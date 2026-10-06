from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from apps.users.models import User
from apps.users.forms import AdminUserCreationForm

@admin.register(User)
class UserAdmin(UserAdmin):
    model = User
    add_form = AdminUserCreationForm
    list_display = ['id', 'username', 'email', 'is_staff', 'is_active']
    search_fields = ('username', 'email')
    ordering = ("-date_joined",)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.filter(
            is_staff=False,
            is_superuser=False,
        )

    fieldsets = (
        (None, {
            "fields": (
                "username",
                "password",
            )
        }),
        ("Personal info", {
            "fields": (
                "email",
                "first_name",
                "last_name",
            )
        }),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important dates", {
            "fields": (
                "last_login",
                "date_joined",
            )
        }),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "password1",
                "password2",
                "is_staff",
                "is_active",
            ),
        }),
    )