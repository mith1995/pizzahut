from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from apps.products.models import ProductVariant
from decimal import Decimal

class Cart(models.Model):
    """
    Session-based cart - inherits from your SoftDeleteModel
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="carts", 
        null=True, 
        blank=True
    )
    session_key = models.CharField(max_length=100, null=True, blank=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Time")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(user__isnull=False),
                name='unique_user_cart'
            )
        ]

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Guest Cart ({self.session_key})"

    def get_total_price(self):
        """Only count active, non-deleted items"""
        return sum(
            item.get_total_price()
            for item in self.items.filter(is_active=True)
        )

    def get_total_items(self):
        return sum(
            item.quantity
            for item in self.items.filter(is_active=True)
        )
    
    @property
    def delivery_fee(self):
        # Yahan apni delivery logic lagao
        # e.g. flat fee, pincode based, weight based, etc.
        if self.get_total_items() == 0:
            return Decimal("0.00")
        return Decimal("50.00")  # example

    @property
    def tax_amount(self):
        # Example: 5% of (total_price + delivery_fee)
        tax_rate = Decimal("0.05")
        return (self.get_total_price() + self.delivery_fee) * tax_rate

    @property
    def discount_amount(self):
        # Coupons, offers logic
        return Decimal("0")

    def get_final_amount(self):
        return self.get_total_price() + self.delivery_fee + self.tax_amount - self.discount_amount

    def is_valid(self):
        """Check if all active items are available and in stock"""
        for item in self.items.filter(is_active=True):
            if not item.is_available():
                return False
        return True

class CartItem(models.Model):
    """
    Cart items with soft delete support
    """
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE   
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'variant'],
                condition=models.Q(is_active=True),
                name='unique_active_cart_variant'
            )
        ]

    def __str__(self):
        return f"{self.quantity} x {self.variant}"

    def get_total_price(self):
        return self.quantity * self.variant.price

    def is_available(self):
        """
        Check if variant is active and requested quantity <= stock
        """
        return (
            self.variant.is_active and
            self.variant.stock >= self.quantity
        )

    def get_max_quantity(self):
        """Maximum quantity user can add based on stock"""
        if self.variant.is_active:
            return self.variant.stock
        return 0