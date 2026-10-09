from rest_framework import serializers
from apps.wishlist.models import WishlistItem
from apps.products.models import Product
from apps.products.serializers import ProductListSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source="product",
        write_only=True
    )
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product_id",
            "product",
            "created_at"
        ]
