from rest_framework import serializers
from apps.core.serializers import BasePriceSerializer
from apps.products.models import ProductVariant
from apps.cart.models import Cart, CartItem

class ProductVariantSerializer(BasePriceSerializer, serializers.ModelSerializer):
    category = serializers.CharField(source="product.category.name", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    size_display = serializers.CharField(source="size.name", read_only=True)
    ingredients = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            'id', 'product', 'category', 'product_name', 'product_slug', 'product_image', 'ingredients', 'size', 'size_display', 'price', 'stock', 'sku', 'currency_symbol'
        ]

    def get_product_image(self, obj):
        request = self.context.get('request')

        if obj.product.image:
            if request:
                return request.build_absolute_uri(
                    obj.product.image.url
                )

            return obj.product.image.url
        return None

    def get_ingredients(self, obj):
        return list(
            obj.product.ingredients.values_list(
                'name',
                flat=True
            )
        )

class CartItemSerializer(BasePriceSerializer, serializers.ModelSerializer):
    variant = ProductVariantSerializer(read_only=True)
    variant_id = serializers.IntegerField(write_only=True)
    total_price = serializers.SerializerMethodField()
    max_quantity = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'variant', 'variant_id', 'quantity', 'total_price', 'max_quantity', 'is_available', 'is_active', 'currency_symbol'
        ]
        read_only_fields = ['id', 'is_active']

    def get_total_price(self, obj):
        return obj.get_total_price()
    
    def get_max_quantity(self, obj):
        return obj.get_max_quantity()

    def get_is_available(self, obj):
        return obj.is_available()

    def validate_variant_id(self, value):
        """Check if variant exists, is active, and not deleted"""
        try:
            variant = ProductVariant.objects.select_related('product').get(
                id=value,
                is_active=True
            )

            if variant.stock <= 0:
                raise serializers.ValidationError("Out of stock")
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Invalid variant")
        return value

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value

    def validate(self, attrs):
        """Validate quantity against variant stock"""
        variant_id = attrs.get('variant_id')
        quantity = attrs.get('quantity')

        if variant_id and quantity:
            try:
                variant = ProductVariant.objects.get(
                    id=variant_id,
                    is_active=True
                )
                if quantity > variant.stock:
                    raise serializers.ValidationError(
                        f"Only {variant.stock} items available in stock"
                    )
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError("Invalid variant")

        return attrs

class CartSerializer(BasePriceSerializer, serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()
    delivery_fee = serializers.SerializerMethodField()
    tax_amount = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    final_amount = serializers.SerializerMethodField()
    is_valid = serializers.SerializerMethodField()
    currency_symbol = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id', 'items', 'total_price', 'total_items', 'delivery_fee', 'tax_amount', 'discount_amount', 'final_amount', 'is_valid', 'currency_symbol', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        return obj.get_total_price()

    def get_total_items(self, obj):
        return obj.get_total_items()

    def get_delivery_fee(self, obj):
        return obj.delivery_fee

    def get_tax_amount(self, obj):
        return obj.tax_amount

    def get_discount_amount(self, obj):
        return obj.discount_amount

    def get_final_amount(self, obj):
        return obj.get_final_amount()

    def get_is_valid(self, obj):
        return obj.is_valid()