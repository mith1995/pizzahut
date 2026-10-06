from rest_framework import serializers
from apps.payments.models import PaymentSession, PaymentAttempt

class CreatePaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()

class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_payment_id = serializers.CharField(
        max_length=100
    )
    razorpay_order_id = serializers.CharField(
        max_length=100
    )
    razorpay_signature  = serializers.CharField(
        max_length = 255
    )

class PaymentFailedSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(
        max_length=100
    )

    payment_id = serializers.CharField(
        max_length = 100,
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    code = serializers.CharField(
        max_length = 100,
        required = False,
        allow_blank = True,
    )

    description = serializers.CharField(
        required = False,
        allow_blank = True,
    )

    source = serializers.CharField(
        required = False,
        allow_blank = True,
    )

    step = serializers.CharField(
        required = False,
        allow_blank = True,
    )

    reason = serializers.CharField(
        required = False,
        allow_blank = True
    )

class PaymentAttemptHistorySerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = PaymentAttempt
        fields = [
            "id",
            "razorpay_payment_id",
            "razorpay_order_id",
            "status",
            "failure_code",
            "failure_description",
            "attempted_at",
            "updated_at",
        ]
        read_only_fields = fields

class PaymentAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentAttempt
        fields = [
            "id",
            "payment_session",
            "razorpay_payment_id",
            "razorpay_order_id",
            "razorpay_signature",
            "status",
            "failure_code",
            "failure_description",
            "raw_response",
            "attempted_at",
            "updated_at",
        ]
        read_only_fields = fields

class PaymentSessionSerializer(serializers.ModelSerializer):
    attempts = PaymentAttemptSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = PaymentSession
        fields = [
            "id",
            "order",
            "user",
            "amount",
            "currency",
            "razorpay_order_id",
            "status",
            "total_attempts",
            "paid_at",
            "created_at",
            "updated_at",
            "attempts",
        ]
        read_only_fields = fields

class PaymentHistorySerializer(serializers.ModelSerializer):
    attempts = PaymentAttemptHistorySerializer(
        many=True,
        read_only=True,
    )
    transaction_id = serializers.SerializerMethodField()
    method = serializers.SerializerMethodField()

    class Meta:
        model = PaymentSession
        fields = [
            "id",
            "amount",
            "currency",
            "status",
            "total_attempts",
            "paid_at",
            "created_at",
            "updated_at",
            "transaction_id",
            "method",
            "attempts",
        ]
        read_only_fields = fields

    def _captured_attempt(self, obj):
        # attempts.all() use kiya taaki prefetch ho to extra query na lage
        for attempt in obj.attempts.all():
            if attempt.status == "captured":
                return attempt
        return None

    def get_transaction_id(self, obj):
        attempt = self._captured_attempt(obj)
        return attempt.razorpay_payment_id if attempt else None

    def get_method(self, obj):
        attempt = self._captured_attempt(obj)
        if not attempt:
            return None
        return (attempt.raw_response or {}).get("method")


class PaymentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSession
        fields = [
            "id",
            "amount",
            "currency",
            "status",
            "total_attempts",
            "paid_at",
        ]
        read_only_fields = fields

class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSession
        fields = [
            "id",
            "status",
            "amount",
            "currency",
            "total_attempts",
            "paid_at",
        ]
        read_only_fields = fields

class RazorpayWebhookSerializer(serializers.Serializer):
    event = serializers.CharField(
        max_length=100,
    )

    payload = serializers.JSONField()

    account_id = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )

    created_at = serializers.IntegerField(
        required=False,
    )

class RefundPaymentSerializer(serializers.Serializer):
    payment_id = serializers.CharField(
        max_length=100,
    )

    amount = serializers.IntegerField(
        required=False,
        min_value=1,
    )

    reason = serializers.CharField(
        required=False,
        allow_blank=True,
    )