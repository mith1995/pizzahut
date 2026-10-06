from django.conf import settings
from django.utils import timezone


def get_email_context(**kwargs):
    context = {
        "site_name": "Pizza Restaurant",
        "site_url": settings.FRONTEND_URL,
        "support_email": settings.DEFAULT_FROM_EMAIL,
        "year": timezone.now().year,
    }

    context.update(kwargs)

    return context