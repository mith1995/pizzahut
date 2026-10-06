from django import forms
from django.contrib.auth.forms import UserCreationForm

from apps.users.models import User

class AdminUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "is_staff",
            "is_active",
        )

    def clean_username(self):
        username = self.cleaned_data.get("username")

        if not username:
            raise forms.ValidationError(
                "Admin username is required."
            )
        return username