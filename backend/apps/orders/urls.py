from django.urls import path
from rest_framework.routers import SimpleRouter
from apps.orders.views import CheckoutView, OrderViewSet

router = SimpleRouter()
router.register(r"", OrderViewSet, basename="orders")

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout")
]

urlpatterns += router.urls