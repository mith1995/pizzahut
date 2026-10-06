from rest_framework import serializers
from apps.locations.models import Country, State, City

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code']

class StateSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    class Meta:
        model = State
        fields = ['id', 'name', 'code', 'country']

class CitySerializer(serializers.ModelSerializer):
    state = StateSerializer(read_only=True)
    class Meta:
        model = City
        fields = ['id', 'name', 'state']