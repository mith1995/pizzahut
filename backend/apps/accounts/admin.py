
from django.contrib import admin
from unfold.admin import ModelAdmin

from apps.accounts.models import Address


@admin.register(Address)
class AddressAdmin(ModelAdmin):
    list_display = [
        "id",
        "user",
        "address_type",
        "address_line1",
        "country",
        "state",
        "city",
        "pincode",
        "is_default",
        "created_at",
    ]

    list_filter = [
        "address_type",
        "is_default",
        "country",
        "state",
        "city",
        "created_at",
    ]

    search_fields = [
        "user__username",
        "user__email",
        "address_line1",
        "address_line2",
        "pincode",
        "country__name",
        "state__name",
        "city__name",
    ]

    list_select_related = [
        "user",
        "country",
        "state",
        "city",
    ]

    readonly_fields = [
        "user",
        "address_type",
        "address_line1",
        "address_line2",
        "country",
        "state",
        "city",
        "pincode",
        "is_default",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-created_at",
    ]

    list_per_page = 25

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False