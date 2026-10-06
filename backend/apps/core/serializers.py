from rest_framework import serializers
from django.conf import settings

class BasePriceSerializer(serializers.Serializer):
    currency_symbol = serializers.SerializerMethodField()

    def get_currency_symbol(self, obj):
        # Global setting se utha lo
        return settings.CURRENCY_CODE 