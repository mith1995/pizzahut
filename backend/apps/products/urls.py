from django.urls import path, include
from apps.products.views import ProductViewSet, ReviewViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"", ProductViewSet, basename='product')

review_list = ReviewViewSet.as_view({"get": "list", "post": "create"})
review_detail = ReviewViewSet.as_view({"patch": "partial_update", "delete": "destroy"})


urlpatterns = [
    path("", include(router.urls)),
    path("<slug:slug>/reviews/", review_list, name="product-reviews"),
    path("<slug:slug>/reviews/<int:pk>/", review_detail, name="product-review-detail"),

]