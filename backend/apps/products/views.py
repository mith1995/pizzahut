from django.shortcuts import render
from apps.products.models import Product
from apps.core.pagination import DefaultPagination
from apps.products.serializers import ProductListSerializer, ProductDetailSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet
# from apps.core.custom_pagination import CustomPagination

class ProductViewSet(ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_deleted = False)
    lookup_field = 'slug'
    pagination_class = DefaultPagination
    # pagination_class = CustomPagination
    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer
