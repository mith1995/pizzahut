from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import ApplicationLoginSerializer, ApplicationRegisterSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, ChangePasswordSerializer, UpdateProfileSerializer
from apps.users.services.email_service import send_verification_email, send_password_reset_email

from apps.users.models import EmailVerificationToken

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = ApplicationRegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        send_verification_email(user=user, token=user.email_verification.token)

        return Response(
            {
                "message": (
                    "Registration successful. "
                    "Please check your email."
                ),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ApplicationLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_200_OK)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response(
                {"detail": "Token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            verification = (
                EmailVerificationToken.objects
                .select_related("user")
                .get(token=token)
            )
            
        except EmailVerificationToken.DoesNotExist:
            return Response(
                {"detail": "Invalid verification token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if verification.is_expired():
            return Response(
                {"detail": "Verification token has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = verification.user
        user.is_active = True
        user.save(update_fields=["is_active"])

        refresh = RefreshToken.for_user(user)
        
        verification.delete()

        return Response(
            {
                "mesage": "Email verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "phone": user.phone,
                    "is_active": user.is_active,
                }
            },
            status=status.HTTP_200_OK,
        )

class ForgetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(
            email__iexact=email,
            is_active=True
        ).first()

        if user:
            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = default_token_generator.make_token(
                user
            )

            frontend_url = (
                f"{settings.FRONTEND_URL}"
                f"/reset-password?uid={uid}&token={token}"
            )

            send_password_reset_email(user=user, reset_url=frontend_url)

        return Response({
            "detail": (
                "If an account with this email exists, "
                "a password reset link has been sent."
            )
        })

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id,
                is_active=True
            )
        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist
        ):
            return Response(
                {"detail": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "detail": "Invalid or expired reset link."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "detail": "Password reset successfully."
        })

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        user =request.user
        user.set_password(
            serializer.validated_data["new_password"]
        )
        user.save(update_fields=['password'])

        return Response({
            "detail": "Password changed successfully"
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UpdateProfileSerializer(request.user)
        return Response(serializer.data)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user, 
            data = request.data, 
            partial=True, 
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "detail": "Profile updated successfully",
            "user": serializer.data
        })