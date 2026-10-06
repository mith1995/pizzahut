from django.contrib import admin, messages
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse

from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import ChoicesRadioFilter
from unfold.decorators import action, display

from apps.orders.models import Order, OrderItem, OrderReturn
from apps.payments.services import refund_payment

PAYMENT_LABELS = {
    "created": "warning",
    "attempted": "warning",
    "paid": "success",
    "failed": "danger",
    "expired": "danger",
    "refunded": "info",
    "refund_pending": "warning",
}


def _captured_attempt(session):
    if not session:
        return None
    return next(
        (a for a in session.attempts.all() if a.status in ("captured", "refunded")),
        None,
    )


class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    show_change_link = False
    fields = ["product_name", "variant_name", "quantity", "price", "show_subtotal"]
    readonly_fields = fields

    @admin.display(description="Subtotal")
    def show_subtotal(self, obj):
        return obj.subtotal

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class OrderReturnInline(TabularInline):
    model = OrderReturn
    extra = 0
    can_delete = False
    show_change_link = True
    fields = ["reason", "status", "refund_amount", "created_at"]
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    compressed_fields = True
    warn_unsaved_form = True

    list_display = [
        "id",
        "show_customer",
        "show_status",
        "show_payment",
        "final_amount",
        "created_at",
    ]
    search_fields = [
        "id",
        "user__email",
        "user__username",
        "first_name",
        "last_name",
        "email",
        "phone",
        "items__product_name",
    ]
    list_filter = [
        ("status", ChoicesRadioFilter),
        "created_at",
        "delivered_at",
    ]
    ordering = ["-created_at"]
    list_select_related = ["user", "payment_session"]
    list_per_page = 25

    readonly_fields = [
        "id",
        "user",
        "status",
        "first_name",
        "last_name",
        "email",
        "phone",
        "shipping_address",
        "shipping_address_snapshot",
        "show_shipping_address",
        "total_amount",
        "delivery_fee",
        "tax_amount",
        "discount_amount",
        "final_amount",
        "cancelled_at",
        "cancel_reason",
        "delivered_at",
        "created_at",
        "updated_at",
        "show_payment_status",
        "show_payment_method",
        "show_transaction_id",
        "show_paid_at",
    ]

    fieldsets = (
        (
            "Order Information",
            {"fields": ("id", "user", "status", "created_at", "updated_at")},
        ),
        (
            "Customer",
            {
                "classes": ["tab"],
                "fields": ("first_name", "last_name", "email", "phone"),
            },
        ),
        (
            "Shipping Address",
            {
                "classes": ["tab"],
                "fields": ("show_shipping_address",),
            },
        ),
        (
            "Price Summary",
            {
                "classes": ["tab"],
                "fields": (
                    "total_amount",
                    "delivery_fee",
                    "tax_amount",
                    "discount_amount",
                    "final_amount",
                ),
            },
        ),
        (
            "Payment",
            {
                "classes": ["tab"],
                "fields": (
                    "show_payment_status",
                    "show_payment_method",
                    "show_transaction_id",
                    "show_paid_at",
                ),
            },
        ),
        (
            "Cancellation and Delivery",
            {
                "classes": ["tab"],
                "fields": ("cancelled_at", "cancel_reason", "delivered_at"),
            },
        ),
    )

    inlines = [OrderItemInline, OrderReturnInline]

    # Order detail page ke upar buttons
    actions_detail = [
        "confirm_order",
        "ship_order",
        "out_for_delivery_order",
        "deliver_order",
        "cancel_order",
    ]
    # List mein har row ke menu mein
    actions_row = ["confirm_order", "ship_order", "deliver_order"]

    # ---------- Permissions ----------
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    # ---------- List / detail display ----------
    @display(description="Customer", ordering="user__email", header=True)
    def show_customer(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return (full_name or obj.email or obj.user.username, obj.email or "")

    @display(
        description="Status",
        ordering="status",
        label={
            "pending": "warning",
            "confirmed": "info",
            "shipped": "info",
            "out_for_delivery": "info",
            "delivered": "success",
            "cancelled": "danger",
            "returned": "danger",
        },
    )
    def show_status(self, obj):
        return obj.status

    @display(description="Payment", label=PAYMENT_LABELS)
    def show_payment(self, obj):
        session = getattr(obj, "payment_session", None)
        return session.status if session else "-"

    @admin.display(description="Shipping address")
    def show_shipping_address(self, obj):
        a = obj.shipping_address_snapshot or {}
        if not isinstance(a, dict):
            return str(a)
        parts = [
            a.get("line1"),
            a.get("line2"),
            a.get("city"),
            a.get("state"),
            a.get("postal_code"),
            a.get("country"),
        ]
        return ", ".join(str(p) for p in parts if p) or "-"

    @admin.display(description="Payment status")
    def show_payment_status(self, obj):
        session = getattr(obj, "payment_session", None)
        return session.get_status_display() if session else "No payment started"

    @admin.display(description="Payment method")
    def show_payment_method(self, obj):
        attempt = _captured_attempt(getattr(obj, "payment_session", None))
        method = (attempt.raw_response or {}).get("method") if attempt else None
        return method.upper() if method else "-"

    @admin.display(description="Transaction ID")
    def show_transaction_id(self, obj):
        attempt = _captured_attempt(getattr(obj, "payment_session", None))
        return attempt.razorpay_payment_id if attempt else "-"

    @admin.display(description="Paid on")
    def show_paid_at(self, obj):
        session = getattr(obj, "payment_session", None)
        return session.paid_at if session and session.paid_at else "-"

    # ---------- Actions ----------
    def _back(self, object_id):
        return redirect(reverse("admin:orders_order_change", args=[object_id]))

    def _move(self, request, object_id, new_status, label):
        order = get_object_or_404(Order, pk=object_id)
        try:
            order.change_status(new_status)
            messages.success(request, f"Order #{order.id} marked as {label}.")
        except ValueError as e:
            messages.error(request, f"Order #{order.id}: {e}")
        return self._back(object_id)

    @action(description="Confirm order")
    def confirm_order(self, request, object_id):
        return self._move(request, object_id, "confirmed", "Confirmed")

    @action(description="Mark shipped")
    def ship_order(self, request, object_id):
        return self._move(request, object_id, "shipped", "Shipped")

    @action(description="Out for delivery")
    def out_for_delivery_order(self, request, object_id):
        return self._move(request, object_id, "out_for_delivery", "Out for delivery")

    @action(description="Mark delivered")
    def deliver_order(self, request, object_id):
        return self._move(request, object_id, "delivered", "Delivered")

    @action(description="Cancel order")
    def cancel_order(self, request, object_id):
        order = get_object_or_404(Order, pk=object_id)
        try:
            order.cancel(reason="Cancelled by admin")
        except ValueError as e:
            messages.error(request, f"Order #{order.id}: {e}")
            return self._back(object_id)

        session = getattr(order, "payment_session", None)
        if session and session.status == "paid":
            try:
                refund_payment(session)
                messages.success(request, f"Order #{order.id} cancelled and refund initiated.")
            except Exception:
                session.status = "refund_pending"
                session.save(update_fields=["status", "updated_at"])
                messages.warning(
                    request,
                    f"Order #{order.id} cancelled, but refund failed. Marked refund pending.",
                )
        else:
            messages.success(request, f"Order #{order.id} cancelled.")
        return self._back(object_id)


@admin.register(OrderReturn)
class OrderReturnAdmin(ModelAdmin):
    list_display = ["id", "order", "reason", "show_status", "refund_amount", "created_at"]
    list_filter = [("status", ChoicesRadioFilter), "reason"]
    search_fields = ["order__id", "order__first_name", "order__email"]
    list_select_related = ["order"]
    ordering = ["-created_at"]

    readonly_fields = ["order", "reason", "comment", "status", "created_at", "updated_at"]
    fields = [
        "order",
        "reason",
        "comment",
        "status",
        "refund_amount",   # sirf yahi editable hai (partial refund ke liye)
        "admin_note",
        "created_at",
        "updated_at",
    ]

    actions_detail = ["approve", "reject", "picked_up", "received", "refund"]
    actions_row = ["approve", "reject"]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @display(
        description="Status",
        ordering="status",
        label={
            "requested": "warning",
            "approved": "info",
            "rejected": "danger",
            "picked_up": "info",
            "received": "info",
            "refunded": "success",
        },
    )
    def show_status(self, obj):
        return obj.status

    def _back(self, object_id):
        return redirect(reverse("admin:orders_orderreturn_change", args=[object_id]))

    def _move(self, request, object_id, from_states, new_status):
        ret = get_object_or_404(OrderReturn, pk=object_id)
        if ret.status not in from_states:
            messages.error(request, f"Cannot move a '{ret.status}' return to '{new_status}'.")
        else:
            ret.status = new_status
            ret.save(update_fields=["status", "updated_at"])
            messages.success(request, f"Return #{ret.id} marked {new_status}.")
        return self._back(object_id)

    @action(description="Approve")
    def approve(self, request, object_id):
        return self._move(request, object_id, ["requested"], "approved")

    @action(description="Reject")
    def reject(self, request, object_id):
        return self._move(request, object_id, ["requested"], "rejected")

    @action(description="Mark picked up")
    def picked_up(self, request, object_id):
        return self._move(request, object_id, ["approved"], "picked_up")

    @action(description="Mark received")
    def received(self, request, object_id):
        return self._move(request, object_id, ["picked_up"], "received")

    @action(description="Refund and close")
    def refund(self, request, object_id):
        ret = get_object_or_404(
            OrderReturn.objects.select_related("order__payment_session"), pk=object_id
        )
        if ret.status != "received":
            messages.error(request, "Refund is only possible after the item is received.")
            return self._back(object_id)

        session = getattr(ret.order, "payment_session", None)
        amount = ret.refund_amount or ret.order.final_amount
        try:
            if session:
                refund_payment(session, amount=amount)
            ret.refund_amount = amount
            ret.save(update_fields=["refund_amount", "updated_at"])
            ret.mark_refunded()
            messages.success(request, f"Return #{ret.id} refunded.")
        except Exception as e:
            messages.error(request, f"Refund failed: {e}")
        return self._back(object_id)