from django.db import models
from apps.users.models import User
from django.utils.text import slugify
from django.core.validators import RegexValidator
from apps.core.models import SoftDeleteModel

class Category(SoftDeleteModel):
    name = models.CharField(max_length=30, unique=True, validators=[
        RegexValidator(
            regex=r"^[A-Za-z\s]+$",
            message="Category name must contain only letters and spaces"
        )
    ])
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to="categories", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Ingredient(SoftDeleteModel):
    name = models.CharField(max_length=100, unique=True, validators=[
        RegexValidator(
            regex=r"^[A-Za-z\s]+$",
            message="Ingredient name must contain only letters and spaces"            
        )
    ])

    def __str__(self):
        return self.name

class Tag(SoftDeleteModel):
    name = models.CharField(max_length=50, unique=True, validators=[
        RegexValidator(
            regex=r"^[A-Za-z\s]+$",
            message="Tag must contain only letters and spaces"            
        )
    ])
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(SoftDeleteModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to="products/")
    short_description = models.CharField(max_length=255)
    description = models.TextField()
    ingredients = models.ManyToManyField(Ingredient,related_name="products", blank=True)
    tags = models.ManyToManyField(Tag, related_name="products", blank=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while Product.all_objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Size(SoftDeleteModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="variants")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields= ["product", "size"],
                name="unique_product_size"
            )
        ]

    def __str__(self):
        return f"{self.product.name} - {self.size.name}"

class Review(SoftDeleteModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()

    def __str__(self):
        return f"{self.product.name} - {self.rating}"