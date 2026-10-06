from rest_framework import viewsets, permissions
from apps.locations.models import Country, State, City
from apps.locations.Serializers import CountrySerializer, StateSerializer, CitySerializer
from apps.core.responses import success_response, error_response

class CountryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        queryset = Country.objects.all()
        search = self.request.query_params.get('search')

        if search:
            queryset = queryset.filter(
                name__icontains = search
            )

        return queryset

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.filter_queryset(self.get_queryset()), many=True)
        return success_response(
            "Countries fetched successfully", 
            serializer.data
        )

class StateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StateSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        country_id = self.request.query_params.get('country')
        search = self.request.query_params.get('search')

        queryset = State.objects.filter(
            country_id=country_id
        )

        if search:
            queryset = queryset.filter(
                name__icontains = search
            )

        return queryset

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.filter_queryset(self.get_queryset()), many=True)
        return success_response(
            "States fetched successfully", 
            serializer.data
        )

class CityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CitySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        state_id = self.request.query_params.get('state')
        search = self.request.query_params.get('search')
        
        queryset = City.objects.filter(
            state_id=state_id
        )

        if search:
            queryset = queryset.filter(
                name__icontains = search
            )

        return queryset

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.filter_queryset(self.get_queryset()), many=True)
        return success_response("Cities fetched successfully", serializer.data)