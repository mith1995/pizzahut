from django.db import models
from django.conf import settings

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, blank=True)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name

class State(models.Model):
    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name="states")
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=10, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["country", "name"],
                name="unique_state_per_country"
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.country.name})"

class City(models.Model):
    state = models.ForeignKey(State, on_delete=models.PROTECT, related_name="cities")
    name = models.CharField(max_length=150)

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

        constraints = [
            models.UniqueConstraint(
                fields=["state", "name"],
                name="unique_city_per_state"
            )
        ]
    def __str__(self):
        return f"{self.name} ({self.state.name})"
