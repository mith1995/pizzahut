from pathlib import Path
import os

import dj_database_url
from decouple import config, Csv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Production: set SECRET_KEY in the environment (Render generates one). The default is for local dev only.
SECRET_KEY = config(
    "SECRET_KEY",
    default='django-insecure-$kxwc1mg5t1lp-u1iy4bkx8((v(68la=wr@9+=@_63mr%&omi2',
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG", default=True, cast=bool)

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())


# Application definition

INSTALLED_APPS = [
    'apps.core',
    'unfold',
    'unfold.contrib.filters',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'apps.products',
    'apps.users',
    'apps.cart',
    'apps.locations',
    'apps.accounts',
    'apps.orders',
    'apps.payments',
    'apps.wishlist',
    'corsheaders',
    'django_extensions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

AUTH_USER_MODEL = "apps.users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # "DEFAULT_PERMISSION_CLASSES": (
    #     "rest_framework.permissions.IsAuthenticated",
    # ),
    "EXCEPTION_HANDLER": "apps.core.exceptions.custom_exception_handler",
}

# Database
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases

# Local: SQLite. Production: set DATABASE_URL (Neon Postgres connection string).
DATABASES = {
    'default': dj_database_url.config(
        env='DATABASE_URL',
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=0,  # Neon suspends idle connections, so don't keep them open
    )
}


# Password validation
# https://docs.djangoproject.com/en/6.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.1/howto/static-files/

STATIC_URL = 'static/'


# Email
# https://docs.djangoproject.com/en/6.1/topics/email/#topic-email-configuration

MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}

AUTH_USER_MODEL = 'users.User'

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

import os

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}

# Uploaded images (products etc.): Render's disk is wiped on every deploy, so in production
# they live on Cloudinary. Set CLOUDINARY_URL (cloudinary://key:secret@cloud_name) to enable;
# when it is not set (local dev) the normal media/ folder is used.
CLOUDINARY_URL = config("CLOUDINARY_URL", default="")
if CLOUDINARY_URL:
    os.environ["CLOUDINARY_URL"] = CLOUDINARY_URL  # the cloudinary SDK reads it from the environment
    STORAGES["default"] = {"BACKEND": "apps.core.storage.CloudinaryMediaStorage"}

# Render terminates TLS at its proxy
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", default="http://localhost:5173", cast=Csv()
)
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default="", cast=Csv())

from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=24),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=28),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Email Configurations
MAILERS = {
    "default": {
        "BACKEND": (
            "django.core.mail.backends.smtp.EmailBackend"
        ),
        "OPTIONS": {
            "host": config(
                "MAILTRAP_HOST",
                default="sandbox.smtp.mailtrap.io",
            ),
            "port": config(
                "MAILTRAP_PORT",
                default=2525,
                cast=int,            
            ),
            "username": config("MAILTRAP_USERNAME"),
            "password": config("MAILTRAP_PASSWORD"),
            "use_tls": config(
                "MAILTRAP_USE_TLS",
                default=True,
                cast=bool,
            ),
            "use_ssl": False,
        }
    }
}

DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL",
    default="noreply@example.com",
)

FRONTEND_URL = config(
    "FRONTEND_URL",
    default="http://localhost:5173",
)

RAZORPAY_KEY_ID = config("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = config("RAZORPAY_KEY_SECRET")
# Used by apps/payments/views.py (RazorpayWebhookView); was referenced but never defined
RAZORPAY_WEBHOOK_SECRET = config("RAZORPAY_WEBHOOK_SECRET", default="")

CURRENCY_CODE = 'INR'

INVOICE_COMPANY = {
    "name": "Pizza Hut Store",
    "address": "301, Western Cooridor near gas station Adajan Patiya, Surat",
    "gstin": "24BS343GHJ00",
    "email": "support@pizzahut.com",
    "phone": "+91 98765 43210",
}

RETURN_WINDOW_DAYS = 7

from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

UNFOLD = {
    "SITE_TITLE": "Pizza Hut",
    "SITE_HEADER": "Pizza Hut",
    "SITE_URL": "/",

    "SIDEBAR": {
        "show_search": True,

        # False karne par default Django ke all apps/models nahi dikhenge
        "show_all_applications": False,

        "navigation": [
            # Dashboard
            {
                # "title": _("Dashboard"),
                # "separator": True,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                    },
                ],
            },

            # Orders
            {
                "items": [
                    {
                        "title": _("All Orders"),
                        "icon": "receipt_long",
                        "link": "/admin/orders/order/",
                    },
                ],
            },

            # Payments
            {
                "items": [
                    {
                        "title": _("Payments"),
                        "icon": "wallet",
                        "link": reverse_lazy(
                            "admin:payments_paymentsession_changelist"
                        ),
                    },
                ],
            },

            # Products
            {
                "title": _("Store Management"),
                "icon": "inventory_2",
                "collapsible": True,
                "items": [
                    {
                        "title": _("Products"),
                        "icon": "shopping_bag",
                        "link": reverse_lazy(
                            "admin:products_product_changelist"
                        ),
                    },
                    {
                        "title": _("Categories"),
                        "icon": "category",
                        "link": reverse_lazy(
                            "admin:products_category_changelist"
                        ),
                    },
                    {
                        "title": _("Size"),
                        "icon": "crop_free",
                        "link": reverse_lazy(
                            "admin:products_size_changelist"
                        ),
                    },
                    {
                        "title": _("Ingredients"),
                        "icon": "soup_kitchen",
                        "link": reverse_lazy(
                            "admin:products_ingredient_changelist"
                        ),
                    },
                    {
                        "title": _("Tags"),
                        "icon": "sell",
                        "link": reverse_lazy(
                            "admin:products_tag_changelist"
                        ),
                    },
                ],
            },

            # Locations
            {
                "title": _("Locations"),
                "icon": "location_on",
                "collapsible": True,
                "items": [
                    {
                        "title": _("Countries"),
                        "icon": "public",
                        "link": reverse_lazy(
                            "admin:locations_country_changelist"
                        ),
                    },
                    {
                        "title": _("States"),
                        "icon": "map",
                        "link": reverse_lazy(
                            "admin:locations_state_changelist"
                        ),
                    },
                    {
                        "title": _("Cities"),
                        "icon": "location_city",
                        "link": reverse_lazy(
                            "admin:locations_city_changelist"
                        ),
                    },
                ]
            },

            # Customers
            {
                "title": _("Customers"),
                "icon": "people",
                "collapsible": True,
                "items": [
                    {
                        "title": _("All Customers"),
                        "icon": "person",
                        "link": reverse_lazy(
                            "admin:users_user_changelist"
                        )
                    },
                    {
                        "title": _("Addresses"),
                        "icon": "map",
                        "link": reverse_lazy(
                            "admin:accounts_address_changelist"
                        )
                    }
                ]
            },
        ],
    },

    "DASHBOARD_CALLBACK": "apps.core.dashboard.dashboard_callback",

    "TABS": [
        {
            "models": [
                "orders.order",
            ],
            "items": [
                {
                    "title": "All Orders",
                    "link": "/admin/orders/order/",
                },
                {
                    "title": "Pending",
                    "link": (
                        "/admin/orders/order/"
                        "?status__exact=pending"
                    ),
                },
                {
                    "title": "Confirmed",
                    "link": (
                        "/admin/orders/order/"
                        "?status__exact=confirmed"
                    ),
                },
                {
                    "title": "Shipped",
                    "link": (
                        "/admin/orders/order/"
                        "?status__exact=shipped"
                    ),
                },
                {
                    "title": "Delivered",
                    "link": (
                        "/admin/orders/order/"
                        "?status__exact=delivered"
                    ),
                },
                {
                    "title": "Returned",
                    "link": (
                        "/admin/orders/order/"
                        "?status__exact=returned"
                    ),
                },
            ],
        },
    ],
}