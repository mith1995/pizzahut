from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from apps.core.responses import success_response
from apps.wishlist.models import WishlistItem
from apps.wishlist.serializers import WishlistItemSerializer

class WishlistViewSet(
    mixins.ListModelMixin, 
    mixins.CreateModelMixin, 
    mixins.DestroyModelMixin, 
    viewsets.GenericViewSet
):

    permission_classes = [IsAuthenticated]
    serializer_class = WishlistItemSerializer
    lookup_field = "product_id"

    def get_queryset(self):
        return (
            WishlistItem.objects
            .filter(user=self.request.user)
            .select_related("product")
        )

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return success_response("Fetched wishlist products", data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        item, created = WishlistItem.objects.get_or_create(
            user=request.user, product=product
        )
        message = "Added to wishlist" if created else "Already in wishlist"
        return success_response(message, data=self.get_serializer(item).data)

    def destroy(self, request, *args, **kwargs):
        self.get_object().delete()
        return success_response("Removed from wishlist")