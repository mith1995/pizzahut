from rest_framework import serializers

from apps.products.serializers import ProductListSerializer


class HomeSerializer(serializers.Serializer):
    hero = ProductListSerializer(many=True)
    menu = ProductListSerializer(many=True)
    trending = ProductListSerializer(many=True)