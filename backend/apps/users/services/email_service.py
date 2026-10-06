from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from apps.core.email_context import get_email_context

def send_verification_email(user, token):
    verification_url = (
        f"{settings.FRONTEND_URL}"
        f"/verify-email?token={token}"
    )

    username = user.first_name or "User"

    subject = "Confirm your email address"

    message = f"""
Hello {username},

Thank you for registering.

Please confirm your email by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you did not create this account, you can ignore this email.
"""

    send_mail(
        subject=subject,
        message=message.strip(),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False
    )

def send_password_reset_email(*, user, reset_url):

    context = get_email_context(
        user=user,
        reset_url=reset_url,
    )

    text_content = render_to_string(
        "emails/password_reset.txt",
        context
    )

    html_content = render_to_string(
        "emails/password_reset.html",
        context
    )

    email = EmailMultiAlternatives(
        subject="Reset your Pizza Hut password",
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )

    email.attach_alternative(
        html_content,
        "text/html"
    )

    return email.send()
