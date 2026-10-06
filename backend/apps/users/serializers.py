from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from apps.users.models import EmailVerificationToken
from django.core.exceptions import ValidationError as DjangoValidationError

User = get_user_model()

class ApplicationRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only = True,
        min_length = 8,
        style={"input_type": "password"},
    )

    confirm_password = serializers.CharField(
        write_only = True,
        style={"input_type": "password"},
    )

    terms = serializers.BooleanField(
        write_only = True
    )

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone",
            "terms",
            "confirm_password",
        )

        read_only_fields = ("id",)

    def validate_email(self, value):
        value = value.lower().strip()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": "Password do not match."
            })

        try:
            validate_password(password)
        except Exception as error:
            raise serializers.ValidationError({
                "password": list(error.messages)
            })
        
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            email = validated_data['email'],
            password = password,
            username = None,
            **{
                key: value
                for key, value in validated_data.items()
                if key != "email"
            }
        )

        EmailVerificationToken.objects.create(user=user)

        return user


class ApplicationLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs["email"].lower().strip()
        password = attrs['password']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid email or password"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive."
            )

        attrs['user'] = user
        return attrs

        # authenticated_user = authenticate(
        #     username = user.username,
        #     password = password
        # )

        # if authenticated_user is None:
        #     raise serializers.ValidationError(
        #         "Invalid email or password."
        #     )

        # if not authenticated_user.is_active:
        #     raise serializers.ValidationError(
        #         "This account is inactive."
        #     )

        # attrs["user"] = authenticated_user
        # return attrs

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower().strip()

class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only = True,
        min_length = 8
    )
    confirm_password = serializers.CharField(
        write_only = True
    )

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": "Password do not match"
            })

        try:
            validate_password(new_password)
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                "new_password": list(error.password)
            })

        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only = True
    )
    new_password = serializers.CharField(
        write_only = True,
        min_length = 8
    )
    confirm_password = serializers.CharField(
        write_only = True
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(
            attrs['current_password']
        ):
            raise serializers.ValidationError({
                "current_password": "Current password is incorrect."
            })

        if (attrs["new_password"] != attrs["confirm_password"]):
            raise serializers.ValidationError({
                "confirm_password": "Password do not match."
            })

        try:
            validate_password(
                attrs['new_password'],
                user
            )
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                "new_password": list(error.messages)
            })

        if (attrs["current_password"] == attrs["new_password"]):
            raise serializers.ValidationError({
                "new_password": "New password must be different"
            })

        return attrs

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 
            'last_name', 
            'phone', 
            'email'
        ]

        def validate_email(self, value):
            user = self.instance
            value = value.lower().strip()

            if User.objects.filter(
                email__iexact=value
            ).exclude(
                pk=user.pk
            ).exists():
                raise serializers.ValidationError(
                    "This email address is already registered."
                )