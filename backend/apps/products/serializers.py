from rest_framework import serializers
from apps.core.serializers import BasePriceSerializer
from apps.products.models import Category, Ingredient, Tag, Size, Product, ProductVariant

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