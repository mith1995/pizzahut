import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from apps.core.models import SoftDeleteModel
from apps.users.managers import UserManager

class User(AbstractBaseUser, PermissionsMixin, SoftDeleteModel):
    username = models.CharField(max_length=100, unique=True, blank=False, null=True)
    email = models.EmailField(max_length=255, unique=True, blank=False, null=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    terms = models.BooleanField(default=False)

    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    # Default Django authentication identifier
    USERNAME_FIELD = "username"

    # Used by createsuperuser as additional required field
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username or self.email or f"User {self.pk}"

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="email_verification",
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        expiry_time = self.created_at + timezone.timedelta(hours=24)
        return timezone.now() > expiry_time