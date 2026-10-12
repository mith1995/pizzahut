from rest_framework import serializers
from apps.core.serializers import BasePriceSerializer
from apps.products.models import Category, Ingredient, Tag, Size, Product, ProductVariant, Review
from apps.orders.models import OrderItem

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id', 
            'name'
        ]

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = [
            'id',
            'name'
        ]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class ProductVariantSerializer(BasePriceSerializer, serializers.ModelSerializer):
    # size = SizeSerializer(read_only = True)
    size = serializers.CharField(source="size.name", read_only = True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'size',
            'price',
            'stock',
            'sku',
            'is_active',
            'currency_symbol',
        ]


class ProductListSerializer(BasePriceSerializer, serializers.ModelSerializer):
    variant_id = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'variant_id',
            'name',
            'slug',
            'image',
            'short_description',
            'price',
            'is_active',
            'currency_symbol',
        ]

    def get_price(self, obj):
        variant = obj.variants.filter(is_active=True).order_by("id").first()
        return f"{variant.price}" if variant else None

    def get_variant_id(self, obj):
        variant = obj.variants.filter(is_active=True).order_by("id").first()
        return variant.id if variant else None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    ingredients = IngredientSerializer(many=True, read_only=True)
    tags = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'image',
            'short_description',
            'description',
            'category',
            'ingredients',
            'tags',
            'variants',
            'is_active',
        ]

def has_purchased(user, product):
    """User ne ye product kisi delivered order mein liya hai ya nahi."""
    if not user or not user.is_authenticated:
        return False
    return OrderItem.objects.filter(
        order__user=user,
        order__status="delivered",
        variant__product=product,
    ).exists()

def can_review(user, product):
    """Verified purchase ho aur abhi tak review na likha ho."""
    if not has_purchased(user, product):
        return False
    return not Review.objects.filter(user=user, product=product).exists()

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id", "user_name", "is_owner",
            "rating", "comment", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"comment": {"max_length": 1000}}

    def get_user_name(self, obj):
        first = (obj.user.first_name or "").strip()
        last = (obj.user.last_name or "").strip()
        if not first:
            return "Customer"
        return f"{first} {last[0]}." if last else first

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(
            request and request.user.is_authenticated
            and obj.user_id == request.user.id
        )

    def validate(self, attrs):
        # Edit par ye checks nahi chahiye (sirf rating/comment badal sakte hain)
        if self.instance:
            return attrs

        user = self.context["request"].user
        product = self.context["product"]

        if Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("You have already reviewed this product.")

        if not has_purchased(user, product):
            raise serializers.ValidationError(
                "Only customers who received this product can review it."
            )
        return attrs