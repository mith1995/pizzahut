import re
from rest_framework import serializers
from apps.orders.models import Order, OrderItem, OrderReturn
from apps.payments.serializers import PaymentHistorySerializer
from apps.core.serializers import BasePriceSerializer

def _absolute_image_url(serializer, image):
    if not image:
        return None
    request = serializer.context.get("request")
    return request.build_absolute_uri(image.url) if request else image.url

class OrderItemSerializer(BasePriceSerializer, serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "variant",
            "product_name",
            "product_image",
            "variant_name",
            "quantity",
            "price",
            "subtotal",
            "currency_symbol",
        ]
        read_only_fields = fields

    def get_product_image(self, obj):
        if not obj.variant:
            return None
        return _absolute_image_url(self, obj.variant.product.image)

class OrderReturnSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = OrderReturn
        fields = [
            "id",
            "reason",
            "comment",
            "status",
            "status_display",
            "refund_amount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
class OrderListSerializer(BasePriceSerializer, serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    product_name = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "product_name",
            "product_image",
            "status",
            "status_display",
            "final_amount",
            "items_count",
            "payment_status",
            "created_at",
            "currency_symbol",
        ]
        read_only_fields = fields

    def _first_item(self, obj):
        items = list(obj.items.all())
        return items[0] if items else None

    def get_items_count(self, obj):
        return len(obj.items.all())

    def get_payment_status(self, obj):
        session = getattr(obj, "payment_session", None)
        return session.status if session else None

    def get_product_name(self, obj):
        item = self._first_item(obj)
        return item.product_name if item else None

    def get_product_image(self, obj):
        item = self._first_item(obj)
        if not item or not item.variant:
            return None
        return _absolute_image_url(self, item.variant.product.image)

class OrderSerializer(BasePriceSerializer, serializers.ModelSerializer):
    payment = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    can_return = serializers.BooleanField(read_only=True)
    active_return = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "status",
            "status_display",
            "shipping_address_snapshot",
            "total_amount",
            "delivery_fee",
            "tax_amount",
            "discount_amount",
            "final_amount",
            "items",
            "items_count",
            "created_at",
            "delivered_at",
            "cancelled_at",
            "cancel_reason",
            "payment",
            "can_cancel",
            "can_return",
            "active_return",
            "currency_symbol",
        ]
        read_only_fields = fields

    def get_payment(self, obj):
        payment_session = getattr(
            obj,
            "payment_session",
            None,
        )

        if payment_session is None:
            return None

        return PaymentHistorySerializer(
            payment_session,
            context=self.context,
        ).data

    def get_items_count(self, obj):
        return len(obj.items.all())

    def get_active_return(self, obj):
        active = [r for r in obj.returns.all() if r.status != "rejected"]
        if not active:
            return None
        latest = max(active, key=lambda r: r.created_at)
        return OrderReturnSerializer(latest, context=self.context).data

class CancelOrderSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True)

class ReturnRequestSerializer(serializers.Serializer):
    REASON_CHOICES = [
        "damaged",
        "wrong_item",
        "not_as_described",
        "size_issue",
        "quality_issue",
        "other",
    ]
    reason = serializers.ChoiceField(choices=REASON_CHOICES)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)

    def validate(self, attrs):
        if attrs["reason"] == "other" and not attrs.get("comment", "").strip():
            raise serializers.ValidationError(
                {"comment": "Please describe the issue."}
            )
        return attrs

class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField()
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("First name is required.")
        return value

    def validate_phone(self, value):
        # spaces aur dashes hata do, phir check karo
        cleaned = re.sub(r"[\s\-()]", "", value)
        if not re.fullmatch(r"\+?\d{10,14}", cleaned):
            raise serializers.ValidationError(
                "Enter a valid phone number (10 to 14 digits)."
            )
        return cleaned