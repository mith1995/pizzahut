from django.urls import path
from .views import (
    CreatePaymentView, VerifyPaymentView,
    PaymentFailedView, RazorpayWebhookView,
)

urlpatterns = [
    path("create/", CreatePaymentView.as_view()),
    path("verify/", VerifyPaymentView.as_view()),
    path("failed/", PaymentFailedView.as_view()),
    path("webhook/", RazorpayWebhookView.as_view()),
]