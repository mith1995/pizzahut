from rest_framework.routers import DefaultRouter
from apps.wishlist.views import WishlistViewSet

router = DefaultRouter()
router.register("", WishlistViewSet, basename="wishlist")

urlpatterns = router.urls