import json
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.locations.models import Country, State, City

# # #
# 1. https://github.com/dr5hn/countries-states-cities-database/tree/master/json (Go to this url)
# 2. Download the " countries+states+cities.json " on your local computer
# 3. Run below command and import countries, state, and cities recored
# python manage.py import_locations "C:\Users\mip95\Downloads\countries+states+cities.json"

class Command(BaseCommand):
    help = "Import countries, states and cities from a JSON file"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str)

    @transaction.atomic
    def handle(self, *args, **options):
        with open(options["json_file"], encoding="utf-8") as f:
            data = json.load(f)

        for c in data:
            country, _ = Country.objects.get_or_create(
                name=c["name"],
                defaults={"code": c["iso3"] or ""}
            )

            State.objects.bulk_create(
                [
                    State(country=country, name=s["name"], code=s.get("state_code") or "")
                    for s in c.get("states", [])
                ],
                ignore_conflicts=True
            )
            states = {s.name: s for s in State.objects.filter(country=country)}

            cities = [
                City(state=states[s["name"]], name=ct["name"])
                for s in c.get("states", [])
                for ct in s.get("cities", [])
            ]
            City.objects.bulk_create(cities, batch_size=5000, ignore_conflicts=True)

            self.stdout.write(f"Imported {country.name}")