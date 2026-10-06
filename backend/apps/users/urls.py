from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from apps.users.views import UserLoginView, UserRegistrationView, VerifyEmailView, ForgetPasswordView, ResetPasswordView, ChangePasswordView, ProfileView, UpdateProfileView

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="email-login"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("forgot-password/", ForgetPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("update-profile/", UpdateProfileView.as_view(), name="update-profile"),

    # SimpleJWT built-in token endpoints
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),

]
