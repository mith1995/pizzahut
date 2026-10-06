import random
import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from faker import Faker
from apps.products.models import Product, ProductVariant, Category, Size, Ingredient, Tag
from django.utils.text import slugify

class Command(BaseCommand):
    help = "Upload the Pizza image using the Pillow and Requests"

    def handle(self, *args, **options):
        fake = Faker()
        
        self.stdout.write(self.style.WARNING("Starting Pizza image downloadig..."))

        # 1. 'Pizza' कैटेगरी और बाकी बुनियादी डेटा गेट या क्रिएट करें
        category, _ = Category.objects.get_or_create(name="Pizza", defaults={'slug': 'pizza'})
        sizes = [Size.objects.get_or_create(name=name)[0] for name in ["Regular", "Medium", "Large"]]
        ingredients = [Ingredient.objects.get_or_create(name=name)[0] for name in ["Cheese", "Onions", "Capsicum", "Tomato"]]
        tags = [Tag.objects.get_or_create(name=name, defaults={'slug': slugify(name)})[0] for name in ["Spicy", "Veg"]]

        # 2. असली पिज़्ज़ा के नाम और Unsplash के डायरेक्ट इमेज लिंक्स
        pizza_names = [
            "Classic Margherita",
            "Double Cheese Margherita",
            "Farmhouse Pizza",
            "Veggie Supreme",
            "Paneer Tikka Pizza",
            "Mexican Green Wave",
            "Cheese Burst Pizza",
            "Italian Delight",
            "Garden Fresh Pizza",
            "Veg Extravaganza",
            "Spicy Paneer Pizza",
            "Mushroom Magic Pizza",
            "Corn Cheese Pizza",
            "Peri Peri Veg Pizza",
            "Tandoori Paneer Pizza",
            "Five Cheese Pizza",
            "BBQ Chicken Pizza",
            "Pepperoni Feast",
            "Chicken Dominator",
            "Chicken Supreme",
            "Chicken Tikka Pizza",
            "Smoky BBQ Chicken",
            "Hot & Spicy Chicken",
            "Chicken Sausage Pizza",
            "Loaded Chicken Pizza",
            "Garlic Chicken Pizza",
            "Chicken Overload",
            "Chicken Delight Pizza",
            "Chicken Cheese Burst",
            "Chicken Peri Peri Pizza",
            "Burrata Spinach Pizza",
            "Truffle Mushroom Pizza",
            "Napoli Special Pizza",
            "Mediterranean Pizza",
            "Four Cheese Pizza",
            "Rustic Veg Pizza",
            "Olive Jalapeno Pizza",
            "Roasted Veg Pizza",
            "Classic Italian Pizza",
            "Tuscan Veg Pizza",
            "Cheesy Onion Pizza",
            "Golden Corn Pizza",
            "Spinach Alfredo Pizza",
            "Garlic Lovers Pizza",
            "Fiery Jalapeno Pizza",
            "Supreme Loaded Pizza",
            "Veg Paradise Pizza",
            "Chicken Paradise Pizza",
            "Signature House Pizza",
            "Chef Special Pizza",
        ]

        # 2. उनके ठीक सामने वाली Unsplash Unique IDs
        pizza_ids = [
            "1593560708920-61dd98c46a4e",  # Burrata Spinach
            "1513104890138-7c749659a591",  # Classic Margherita
            "1565299624946-b28f40a0ae38",  # Pepperoni Feast
            "1628840042765-356cda07504e",  # Veggie Supreme
            "1574071318508-1cdbab80d002",  # Farmhouse Special
            "1534308983496-4fabb1a015ee",  # Double Cheese
            "1604382354936-07c5d9983bd3",  # Spicy Hot
            "1555072956-7758afb20a8a",  # Thin Crust
            "1590947132387-155cc02f3212",  # Paneer Tikka
            "1601924582970-878714eb89e7",  # BBQ Chicken
        ]

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        }

        for name in pizza_names:

            img_id = random.choice(pizza_ids)

            image_url = f"https://images.unsplash.com/photo-{img_id}?w=600"
            # image_url = f"https://images.unsplash.com/photo-{img_id}?w=600"
            # Prevent Duplicate Recored
            if Product.objects.filter(name=name).exists():
                self.stdout.write(self.style.WARNING(f"⚠ {name} Allready Exists in database"))
                continue

            try:
                
                response = requests.get(image_url, headers=headers, timeout=15)
                
                if response.status_code == 200:
                    file_name = f"{slugify(name)}.jpg"

                    product = Product(
                        category=category,
                        name=name,
                        short_description=fake.sentence(nb_words=10),
                        description=fake.paragraph(nb_sentences=3),
                        is_active=True
                    )

                    product.image.save(file_name, ContentFile(response.content), save=False)
                    product.save()

                    product.ingredients.set(random.sample(ingredients, k=2))
                    product.tags.set(random.sample(tags, k=1))

                    price_mapping = {"Regular": 199, "Medium": 299, "Large": 449}
                    for size_obj in sizes:
                        ProductVariant.objects.create(
                            product=product,
                            size=size_obj,
                            price=price_mapping[size_obj.name] + random.randint(10, 40),
                            stock=random.randint(10, 30),
                            sku=f"PIZ-{slugify(name)[:4].upper()}-{size_obj.name[:3].upper()}"
                        )

                    self.stdout.write(self.style.SUCCESS(f"Downloaded pizza images into the media/products"))
                else:
                    self.stdout.write(self.style.ERROR(f"❌ {name} Download Failed (Status: {response.status_code})"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ {name} Error: {e}"))

        self.stdout.write(self.style.SUCCESS("🎉 All procced completed"))


