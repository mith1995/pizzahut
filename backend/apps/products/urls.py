from django.urls import path, include
from apps.products.views import ProductViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"", ProductViewSet, basename='product')

urlpatterns = [
    path("", include(router.urls)),
]