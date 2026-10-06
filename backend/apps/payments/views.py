import json
import razorpay
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status as http_status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView

from apps.core.responses import success_response, error_response
from apps.orders.models import Order
from apps.payments.models import PaymentSession
from apps.payments.serializers import (
    CreatePaymentSerializer,
    VerifyPaymentSerializer,
    PaymentFailedSerializer,
)
from apps.payments.services import (
    get_razorpay_client,
    to_paise,
    mark_payment_success,
    mark_payment_failed,
)


class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = CreatePaymentSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Invalid data", errors=s.errors)

        order = get_object_or_404(
            Order, id=s.validated_data["order_id"], user=request.user
        )

        session = PaymentSession.objects.filter(order=order).first()
        if session and session.status == "paid":
            return error_response("Order already paid")

        if not session:
            try:
                rp_order = get_razorpay_client().order.create({
                    "amount": to_paise(order.final_amount),
                    "currency": settings.CURRENCY_CODE,
                    "receipt": f"order_{order.id}",
                    "notes": {"order_id": str(order.id)},
                })
            except razorpay.errors.BadRequestError as e:
                return error_response("Could not create payment", errors=str(e))

            session = PaymentSession.objects.create(
                order=order,
                user=request.user,
                amount=order.final_amount,
                currency=settings.CURRENCY_CODE,
                razorpay_order_id=rp_order["id"],
            )

        return success_response(
            "Payment session created",
            data={
                "key_id": settings.RAZORPAY_KEY_ID,
                "razorpay_order_id": session.razorpay_order_id,
                "amount": to_paise(session.amount),
                "currency": session.currency,
                "prefill": {
                    "name": f"{order.first_name} {order.last_name}",
                    "email": order.email,
                    "contact": order.phone,
                },
            },
        )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = VerifyPaymentSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Invalid data", errors=s.errors)
        d = s.validated_data

        session = get_object_or_404(
            PaymentSession,
            razorpay_order_id=d["razorpay_order_id"],
            user=request.user,
        )

        try:
            get_razorpay_client().utility.verify_payment_signature(dict(d))
        except razorpay.errors.SignatureVerificationError:
            return error_response("Payment verification failed")

        mark_payment_success(
            d["razorpay_order_id"],
            d["razorpay_payment_id"],
            signature=d["razorpay_signature"],
        )
        return success_response(
            "Payment successful", data={"order_id": session.order_id}
        )


class PaymentFailedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = PaymentFailedSerializer(data=request.data)
        if not s.is_valid():
            return error_response("Invalid data", errors=s.errors)
        d = s.validated_data

        get_object_or_404(
            PaymentSession,
            razorpay_order_id=d["razorpay_order_id"],
            user=request.user,
        )
        mark_payment_failed(
            d["razorpay_order_id"],
            d.get("payment_id") or None,
            code=d.get("code", ""),
            description=d.get("description", ""),
            raw=dict(d),
        )
        return success_response("Payment failure recorded")


@method_decorator(csrf_exempt, name="dispatch")
class RazorpayWebhookView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        body = request.body.decode("utf-8")
        signature = request.headers.get("X-Razorpay-Signature", "")

        try:
            get_razorpay_client().utility.verify_webhook_signature(
                body, signature, settings.RAZORPAY_WEBHOOK_SECRET
            )
        except razorpay.errors.SignatureVerificationError:
            return error_response("Invalid signature")

        data = json.loads(body)
        event = data.get("event")
        entity = data.get("payload", {}).get("payment", {}).get("entity", {})

        try:
            if event == "payment.captured":
                mark_payment_success(entity["order_id"], entity["id"], raw=entity)
            elif event == "payment.failed":
                mark_payment_failed(
                    entity["order_id"],
                    entity["id"],
                    code=entity.get("error_code") or "",
                    description=entity.get("error_description") or "",
                    raw=entity,
                )
        except PaymentSession.DoesNotExist:
            pass

        return success_response("Webhook processed")