from django.contrib import admin, messages
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse

from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import ChoicesRadioFilter
from unfold.decorators import action, display

from apps.payments.models import PaymentSession, PaymentAttempt
from apps.payments.services import (
    get_razorpay_client,
    mark_payment_success,
    refund_payment,
)

SESSION_LABELS = {
    "created": "warning",
    "attempted": "warning",
    "paid": "success",
    "failed": "danger",
    "expired": "danger",
    "refunded": "info",
    "refund_pending": "warning",
}


class PaymentAttemptInline(TabularInline):
    model = PaymentAttempt
    extra = 0
    can_delete = False
    # raw_response aur signature jaanbujhkar nahi dikhaye
    fields = [
        "razorpay_payment_id",
        "status",
        "failure_code",
        "failure_description",
        "attempted_at",
    ]
    readonly_fields = fields

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(PaymentSession)
class PaymentSessionAdmin(ModelAdmin):
    list_display = [
        "id",
        "show_order",
        "show_customer",
        "show_status",
        "amount",
        "total_attempts",
        "paid_at",
        "created_at",
    ]
    list_filter = [("status", ChoicesRadioFilter), "created_at", "paid_at"]
    search_fields = [
        "razorpay_order_id",
        "attempts__razorpay_payment_id",
        "order__id",
        "order__email",
        "order__first_name",
        "user__email",
    ]
    list_select_related = ["order", "user"]
    ordering = ["-created_at"]
    list_per_page = 25
    inlines = [PaymentAttemptInline]

    fields = [
        "order",
        "user",
        "amount",
        "currency",
        "status",
        "razorpay_order_id",
        "total_attempts",
        "paid_at",
        "created_at",
        "updated_at",
    ]
    readonly_fields = fields

    actions_detail = ["sync_with_razorpay", "retry_refund"]
    actions_row = ["sync_with_razorpay"]

    # Payment record kabhi haath se add ya delete nahi hona chahiye
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @display(description="Order", ordering="order__id")
    def show_order(self, obj):
        return f"#OD-{obj.order_id}"

    @display(description="Customer", ordering="user__email")
    def show_customer(self, obj):
        name = f"{obj.order.first_name} {obj.order.last_name}".strip()
        return name or obj.user.email

    @display(description="Status", ordering="status", label=SESSION_LABELS)
    def show_status(self, obj):
        return obj.status

    def _back(self, object_id):
        return redirect(reverse("admin:payments_paymentsession_change", args=[object_id]))

    @action(description="Sync with Razorpay")
    def sync_with_razorpay(self, request, object_id):
        """Webhook miss ho gaya ho to Razorpay se asli status mangwa lo."""
        session = get_object_or_404(PaymentSession, pk=object_id)

        if session.status in ("paid", "refunded", "refund_pending"):
            messages.info(request, "This payment is already settled.")
            return self._back(object_id)

        try:
            data = get_razorpay_client().order.payments(session.razorpay_order_id)
            captured = next(
                (p for p in data.get("items", []) if p.get("status") == "captured"),
                None,
            )
            if not captured:
                messages.warning(request, "Razorpay has no captured payment for this order.")
                return self._back(object_id)

            mark_payment_success(
                session.razorpay_order_id, captured["id"], raw=captured
            )
            messages.success(request, "Payment synced and marked paid.")
        except Exception as e:
            messages.error(request, f"Sync failed: {e}")
        return self._back(object_id)

    @action(description="Retry refund")
    def retry_refund(self, request, object_id):
        session = get_object_or_404(PaymentSession, pk=object_id)

        if session.status != "refund_pending":
            messages.error(request, "Only 'refund pending' payments can be retried.")
            return self._back(object_id)

        try:
            refund_payment(session)
            messages.success(request, "Refund initiated.")
        except Exception as e:
            messages.error(request, f"Refund failed again: {e}")
        return self._back(object_id)