from django.conf import settings
from django.db.models import Count, Prefetch
from rest_framework import views, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa

from apps.cart.models import Cart
from apps.accounts.models import Address
from apps.orders.models import Order
from apps.orders.serializers import OrderSerializer, CheckoutSerializer, OrderListSerializer, CancelOrderSerializer, ReturnRequestSerializer
from apps.payments.services import refund_payment
from apps.core.responses import success_response, error_response
from apps.core.custom_pagination import CustomPagination


import logging
logger = logging.getLogger(__name__)

class CheckoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        checkout_serializer = CheckoutSerializer(data=request.data)
        if not checkout_serializer.is_valid():
            return error_response(
                message="Validation failed",
                errors=checkout_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        data = checkout_serializer.validated_data

        # Validate address belongs to user
        try:
            address = Address.objects.get(user=request.user, id=data["address_id"])
        except Address.DoesNotExist:
            return error_response(
                message="Invalid address", 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get user cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return error_response(
                message="Cart not found", 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check cart has items
        if not cart.items.exists():
            return error_response(
                message="Cart is empty",
                status=status.HTTP_400_BAD_REQUEST
            )

        contact = {
            "first_name": data.get("first_name"),
            "last_name": data.get("last_name", ""),
            "email": data.get("email"),
            "phone": data.get("phone")
        }

        # Create order
        try:
            order = Order.create_from_cart(cart, address, contact)
        except ValueError as e:
            return error_response(
                message=str(e),
                status=status.HTTP_400_BAD_REQUEST
            )

        return success_response(
            message="Order placed successfully", 
            data=OrderSerializer(order).data, 
            status=status.HTTP_201_CREATED
        )

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination

    def get_serializer_class(self):
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def get_queryset(self):
        qs = (
            Order.objects
            .filter(user=self.request.user)   # dusre user ka order kabhi nahi milega
            .select_related("payment_session")
            .order_by("-created_at")
        )

        if self.action == "list":
            order_status = self.request.query_params.get("status")
            if order_status:
                qs = qs.filter(status=order_status)
            return qs.prefetch_related("items__variant__product")

        return qs.prefetch_related(
            "items__variant__product",
            "returns",
            "payment_session__attempts",
        )

    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(order)
        return success_response("Order fetched successfully", data=serializer.data)

    def _fresh_order_response(self, request, pk, message, http_status=status.HTTP_200_OK):
        order = self.get_queryset().get(pk=pk)
        return success_response(
            message=message,
            data=OrderSerializer(order, context={"request": request}).data,
            status=http_status,
        )

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        serializer = CancelOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Validation failed",
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = self.get_object()

        try:
            order.cancel(reason=serializer.validated_data.get("reason", ""))
        except ValueError as e:
            return error_response(message=str(e), status=status.HTTP_400_BAD_REQUEST)

        # Refund DB transaction ke BAAD, kyunki ye external API call hai
        session = getattr(order, "payment_session", None)
        message = "Order cancelled successfully"

        if session and session.status == "paid":
            try:
                refund_payment(session)
                message = "Order cancelled. Your refund has been initiated."
            except Exception:
                logger.exception("Refund failed for order %s", order.pk)
                session.status = "refund_pending"
                session.save(update_fields=["status", "updated_at"])
                message = "Order cancelled. Your refund is being processed."

        return self._fresh_order_response(request, order.pk, message)

    @action(detail=True, methods=["post"], url_path="return")
    def request_return(self, request, pk=None):
        serializer = ReturnRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Validation failed",
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = self.get_object()

        try:
            order.request_return(**serializer.validated_data)
        except ValueError as e:
            return error_response(message=str(e), status=status.HTTP_400_BAD_REQUEST)

        return self._fresh_order_response(
            request,
            order.pk,
            "Return request submitted successfully",
            status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"], url_path="invoice")
    def invoice(self, request, pk=None):
        order = self.get_object()

        if order.status in ("pending", "cancelled"):
            return error_response(
                message="Invoice is not available for this order.",
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            pdf = build_invoice_pdf(order)
        except RuntimeError:
            return error_response(
                message="Could not generate invoice",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="invoice-OD-{order.id}.pdf"'
        return response

    @action(detail=True, methods=["post"], url_path="return/cancel")
    def cancel_return(self, request, pk=None):
        order = self.get_object()
        ret = order.active_return
        if not ret:
            return error_response(message="No return found.", status=status.HTTP_400_BAD_REQUEST)
        try:
            ret.cancel_by_customer()
        except ValueError as e:
            return error_response(message=str(e), status=status.HTTP_400_BAD_REQUEST)
        return self._fresh_order_response(request, order.pk, "Return cancelled")