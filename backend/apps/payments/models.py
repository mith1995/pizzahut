from django.db import models
from django.conf import settings
from apps.orders.models import Order

class PaymentSession(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("attempted", "Attempted"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("expired", "Expired"),
        ("refunded", "Refunded"),
    ]

    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name="payment_session"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="payment_sessions"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    currency = models.CharField(
        max_length=10,
        default=settings.CURRENCY_CODE
    )

    razorpay_order_id = models.CharField(
        max_length=100,
        unique=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created"
    )

    total_attempts = models.PositiveIntegerField(default=0)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment session for Order #{self.order_id}"

class PaymentAttempt(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    payment_session = models.ForeignKey(
        PaymentSession,
        on_delete=models.PROTECT,
        related_name="attempts"
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        unique=True,
        blank=True,
        null=True
    )

    razorpay_order_id = models.CharField(
        max_length=100
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created"
    )

    failure_code = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    failure_description = models.TextField(
        blank=True,
        null=True
    )

    raw_response = models.JSONField(
        default=dict,
        blank=True
    )

    attempted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-attempted_at"]

    def __str__(self):
        return (
            f"Attempt for Order"
            f"#{self.payment_session.order_id} - {self.status}"
        )