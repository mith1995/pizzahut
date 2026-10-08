"""
Cloudinary-backed storage for uploaded images (products, categories, user avatars).

Why: Render's free disk is wiped on every deploy, so files written to MEDIA_ROOT disappear.
Enabled only when the CLOUDINARY_URL environment variable is set (see config/settings.py),
so local development keeps using the normal media/ folder.

A file stored under the name "products/pizza.jpg" lives in Cloudinary with public_id
"products/pizza" and is delivered as .jpg, so the name saved in the database maps
directly to its URL (this is what lets `upload_media_to_cloudinary` migrate old files
without touching any database rows).
"""
import os

import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from django.core.files.storage import Storage
from django.utils.crypto import get_random_string
from django.utils.deconstruct import deconstructible


def public_id_for(name):
    """'products/pizza.jpg' -> 'products/pizza'"""
    return os.path.splitext(name.replace("\\", "/"))[0]


@deconstructible
class CloudinaryMediaStorage(Storage):
    def get_available_name(self, name, max_length=None):
        # Always add a random suffix so two uploads with the same file name never overwrite each other.
        root, ext = os.path.splitext(name.replace("\\", "/"))
        suffix = "_" + get_random_string(7)
        if max_length:
            root = root[: max(1, max_length - len(ext) - len(suffix))]
        return f"{root}{suffix}{ext}"

    def _save(self, name, content):
        content.seek(0)
        cloudinary.uploader.upload(
            content,
            public_id=public_id_for(name),
            resource_type="image",
            overwrite=True,
            unique_filename=False,
            use_filename=False,
            invalidate=True,
        )
        return name.replace("\\", "/")

    def exists(self, name):
        # Names are made unique in get_available_name, so we never need to ask Cloudinary.
        return False

    def url(self, name):
        root, ext = os.path.splitext(name.replace("\\", "/"))
        return cloudinary_url(root, format=ext.lstrip(".") or None, secure=True)[0]

    def delete(self, name):
        cloudinary.uploader.destroy(public_id_for(name), resource_type="image", invalidate=True)

    def _open(self, name, mode="rb"):
        raise NotImplementedError("Cloudinary files are served by URL and cannot be opened locally.")
