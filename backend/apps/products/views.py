from django.db import IntegrityError
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.core.responses import success_response, error_response

from apps.products.models import Product, Review
from apps.core.pagination import DefaultPagination
from apps.products.serializers import ProductListSerializer, ProductDetailSerializer, ReviewSerializer, can_review
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


class ReviewViewSet(viewsets.GenericViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        # Reviews dekhna public hai, likhna/badalna/hatana login ke baad
        if self.action == "list":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_product(self):
        if not hasattr(self, "_product"):
            self._product = get_object_or_404(
                Product, slug=self.kwargs["slug"], is_active=True
            )
        return self._product

    def get_queryset(self):
        qs = Review.objects.filter(product=self.get_product()).select_related("user")
        # Edit/delete par sirf apna review milega, doosre ka 404
        if self.action in ("partial_update", "destroy"):
            qs = qs.filter(user=self.request.user)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["product"] = self.get_product()
        return context

    def list(self, request, *args, **kwargs):
        product = self.get_product()
        qs = self.get_queryset()

        stats = qs.aggregate(average=Avg("rating"), count=Count("id"))
        breakdown = {str(star): 0 for star in range(1, 6)}
        for row in qs.order_by().values("rating").annotate(total=Count("id")):
            breakdown[str(row["rating"])] = row["total"]

        data = {
            "summary": {
                "average": round(stats["average"] or 0, 1),
                "count": stats["count"],
                "breakdown": breakdown,
            },
            "can_review": can_review(request.user, product),
            "reviews": self.get_serializer(qs, many=True).data,
        }
        return success_response("Reviews fetched successfully.", data=data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save(user=request.user, product=self.get_product())
        except IntegrityError:
            # Do request ek saath aayi, to DB constraint ne rok liya
            raise serializers.ValidationError("You have already reviewed this product.")
        return success_response("Review added successfully.", data=serializer.data)

    def partial_update(self, request, *args, **kwargs):
        review = self.get_object()
        serializer = self.get_serializer(review, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response("Review updated successfully.", data=serializer.data)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()   # hard delete
        return success_response("Review deleted successfully.")