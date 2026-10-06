from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.cart.views import CartViewSet, GuestCartViewSet

router = DefaultRouter()
router.register(r'', CartViewSet, basename='cart')
router.register(r'guest', GuestCartViewSet, basename='guest-cart')

urlpatterns = [
    path('', include(router.urls))
]
