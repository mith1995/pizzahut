from django.conf import settings
from rest_framework import serializers
from apps.accounts.models import Address
from apps.locations.models import City, State, Country
from apps.locations.Serializers import CountrySerializer, StateSerializer, CitySerializer

MAX_ADDRESSES = getattr(settings, "MAX_ADDRESSES_PER_USER", 5)

class AddressSerializer(serializers.ModelSerializer):
    # Nested read-only for response
    country = CountrySerializer(read_only=True)
    state = StateSerializer(read_only=True)
    city = CitySerializer(read_only=True)

    # Write-only IDs
    country_id = serializers.IntegerField(write_only=True)
    state_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    city_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Address
        fields = [
            'id', 'address_type', 'address_line1', 'address_line2', 'country', 'state',
            'city', 'pincode', 'country_id', 'state_id', 'city_id', 'is_default'
        ]

        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_country_id(self, value):
        try:
            Country.objects.get(id=value)
        except Country.DoesNotExist:
            raise serializers.ValidationError("Invalid country")
        return value

    def validate_state_id(self, value):
        if value is None:
            return value
        if not State.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid state")
        return value

    def validate_city_id(self, value):
        if value is None:
            return value
        if not City.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid city")
        return value

    def validate(self, attrs):
        user = self.context['request'].user

        # Max 5 addresses
        if self.instance is None:
            if user.addressess.count() >= MAX_ADDRESSES:
                raise serializers.ValidationError(f"You can add maximum {MAX_ADDRESSES} addresses.")

        country_id = attrs.get('country_id')
        state_id = attrs.get('state_id')
        city_id = attrs.get('city_id')

        if country_id and state_id:
            state = State.objects.get(id=state_id)
            if state.country_id != country_id:
                raise serializers.ValidationError("State does not belong to selected country.")

        if country_id and not state_id:
            if State.objects.filter(state_id=state_id).exists():
                raise serializers.ValidationError({"state": "State is required for this country."})

        if state_id and city_id:
            city = City.objects.get(id=city_id)
            if city.state_id != state_id:
                raise serializers.ValidationError("City does not belong to selected state.")

        if state_id and not city_id:
            if City.objects.filter(state_id=state_id).exists():
                raise serializers.ValidationError({"city": "City is required for this state."})

        return attrs

    def create(self, validated_data):
        country_id = validated_data.pop('country_id')
        state_id = validated_data.pop('state_id')
        city_id = validated_data.pop('city_id', None)

        country = Country.objects.get(id=country_id)
        state = State.objects.get(id=state_id)
        city = City.objects.get(id=city_id) if city_id else None

        return Address.objects.create(
            country=country,
            state=state,
            city=city,
            **validated_data
        )