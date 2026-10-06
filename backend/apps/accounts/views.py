from django.conf import settings
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from apps.accounts.models import Address
from apps.accounts.serializers import AddressSerializer
from apps.core.responses import success_response, error_response

MAX_ADDRESSES = getattr(settings, "MAX_ADDRESSES_PER_USER", 5)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by(
            '-is_default', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        created = queryset.count()
        serializer = self.get_serializer(queryset, many=True)

        data = {
            "max_allowed": MAX_ADDRESSES,
            "created": created,
            "remaining": max(MAX_ADDRESSES - created, 0),
            "can_add_more": created < MAX_ADDRESSES,
            "addresses": serializer.data
        }

        message = (
            "Addresses retrieved successfully"
            if created
            else "No addresses found"
        )
        return success_response(message, data=data)

    @action(detail=True, methods=["post"], url_path="set-default")
    def set_default(self, request, pk=None):
        address = self.get_object()
        address.is_default = True
        address.save()   # model ka save() baaki ko unset kar dega
        return success_response("Default address updated successfully", data=None)

    def perform_destroy(self, instance):
        user = instance.user
        was_default = instance.is_default

        with transaction.atomic():
            instance.delete()

            if was_default:
                next_address = (
                    Address.objects.filter(user=user)
                    .order_by("-created_at")
                    .first()
                )

                if next_address:
                    next_address.is_default = True
                    next_address.save()

