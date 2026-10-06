from django.contrib import admin
from apps.locations.models import Country, State, City
from django.urls import reverse, path
from django.utils.html import format_html

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'action_buttons']
    search_fields = ("name",)

    list_per_page = 30

    def __str__(self):
        return self.name

    # -------------------------
    # Custom Action buttons (Edit, Delete)
    # -------------------------
    def action_buttons(self, obj):
        # 1. Edit url
        edit_url = reverse('admin:locations_country_change', args=[obj.id])

        # 2. Delete url
        delete_url = reverse('admin:locations_country_delete', args=[obj.id])

        return format_html(
            '<a class="button" href="{}" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; margin-right: 5px;">Edit</a>'
            '<a class="button" href="{}" style="background-color: #ba2121; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none;">Delete</a>',
            edit_url, delete_url
        )
    action_buttons.short_description = 'Actions'

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'country', 'action_buttons']
    search_fields = ("name", "country__name")

    list_per_page = 30

    def __str__(self):
        return self.name

    # -------------------------
    # Custom Action buttons (Edit, Delete)
    # -------------------------
    def action_buttons(self, obj):
        # 1. Edit url
        edit_url = reverse('admin:locations_state_change', args=[obj.id])

        # 2. Delete url
        delete_url = reverse('admin:locations_state_delete', args=[obj.id])

        return format_html(
            '<a class="button" href="{}" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; margin-right: 5px;">Edit</a>'
            '<a class="button" href="{}" style="background-color: #ba2121; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none;">Delete</a>',
            edit_url, delete_url
        )
    action_buttons.short_description = 'Actions'

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'state', 'action_buttons']
    search_fields = ("name", "state__name")

    list_per_page = 30

    def __str__(self):
        return self.name

    # -------------------------
    # Custom Action buttons (Edit, Delete)
    # -------------------------
    def action_buttons(self, obj):
        # 1. Edit url
        edit_url = reverse('admin:locations_city_change', args=[obj.id])

        # 2. Delete url
        delete_url = reverse('admin:locations_city_delete', args=[obj.id])

        return format_html(
            '<a class="button" href="{}" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; margin-right: 5px;">Edit</a>'
            '<a class="button" href="{}" style="background-color: #ba2121; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none;">Delete</a>',
            edit_url, delete_url
        )
    action_buttons.short_description = 'Actions'

    