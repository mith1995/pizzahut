import os
from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import models

from apps.core.storage import public_id_for


class Command(BaseCommand):
    help = (
        "One-off: upload the image files that already exist in the local MEDIA_ROOT to Cloudinary, "
        "using the same names that are stored in the database (no database rows are changed). "
        "Run it on your own computer with CLOUDINARY_URL and DATABASE_URL set."
    )

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="List what would be uploaded, upload nothing.")

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        if not os.environ.get("CLOUDINARY_URL"):
            raise CommandError("CLOUDINARY_URL is not set.")
        if not dry_run:
            import cloudinary.uploader

        media_root = Path(settings.MEDIA_ROOT)
        uploaded, missing = 0, []

        for model in apps.get_models():
            for field in model._meta.concrete_fields:
                if not isinstance(field, models.ImageField):
                    continue
                names = (
                    model._base_manager.exclude(**{f"{field.name}__isnull": True})
                    .exclude(**{field.name: ""})
                    .values_list(field.name, flat=True)
                    .distinct()
                )
                for name in names:
                    label = f"{model._meta.label}.{field.name}: {name}"
                    path = media_root / name
                    if not path.is_file():
                        missing.append(label)
                        continue
                    if dry_run:
                        self.stdout.write(f"would upload  {label}")
                    else:
                        cloudinary.uploader.upload(
                            str(path),
                            public_id=public_id_for(name),
                            resource_type="image",
                            overwrite=True,
                            unique_filename=False,
                            use_filename=False,
                            invalidate=True,
                        )
                        self.stdout.write(f"uploaded     {label}")
                    uploaded += 1

        verb = "would upload" if dry_run else "uploaded"
        self.stdout.write(self.style.SUCCESS(f"\n{verb} {uploaded} file(s)."))
        if missing:
            self.stdout.write(self.style.WARNING(f"{len(missing)} file(s) not found in {media_root}:"))
            for label in missing:
                self.stdout.write(f"  missing  {label}")
