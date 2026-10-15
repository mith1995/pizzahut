from django.db.models import Exists, OuterRef, Prefetch
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.core.responses import success_response
from apps.products.models import Product, ProductVariant

from apps.home.serializers import HomeSerializer


class HomeView(APIView):
    """GET /api/home/ -> hero (random 3), menu (6), trending (6)."""

    permission_classes = [AllowAny]

    def get(self, request):
        active_variants = ProductVariant.objects.filter(is_active=True)

        products = (
            Product.objects.filter(is_active=True, category__is_active=True)
            .filter(Exists(active_variants.filter(product=OuterRef("pk"))))
            .select_related("category")
            .prefetch_related(
                Prefetch("variants", queryset=active_variants.select_related("size")),
                "tags",
            )
        )

        data = {
            "hero": products.order_by("?")[:3],
            "menu": products.order_by("name")[:6],
            "trending": products.order_by("-created_at")[:6],
        }
        serializer = HomeSerializer(data, context={"request": request})
        return success_response("Home fetched successfully.", data=serializer.data)