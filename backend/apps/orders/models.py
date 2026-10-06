from django.db import models
from django.conf import settings
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.db import transaction
from apps.accounts.models import Address
from apps.products.models import ProductVariant
from django.utils import timezone
from datetime import timedelta

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out for delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("returned", "Returned"),
    ]

    CANCELLABLE = ("pending", "confirmed")

    ALLOWED_TRANSITIONS = {
        "pending": {"confirmed", "cancelled"},
        "confirmed": {"shipped", "cancelled"},
        "shipped": {"out_for_delivery", "delivered"},
        "out_for_delivery": {"delivered"},
        "delivered": set(),      # returned sirf return flow se hota hai
        "cancelled": set(),
        "returned": set(),
    }

    # Kis status par customer ko email jaye
    STATUS_EMAIL = {
        "confirmed": "confirmed",
        "delivered": "delivered",
    }

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    # Address ForeignKey + Snapshot
    shipping_address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        related_name="shipping_orders"
    )
    shipping_address_snapshot = models.JSONField()

    # Contact Details
    first_name = models.CharField(max_length=100, default="")
    last_name = models.CharField(max_length=100, default="")
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=15, default="")

    # Price fields
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    discount_amount  = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=255, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.id} by {self.first_name}"

    def save(self, *args, **kwargs):
        prev_status = None
        if self.pk:
            prev_status = (
                Order.objects.filter(pk=self.pk)
                .values_list("status", flat=True)
                .first()
            )

        if self.status == "delivered" and not self.delivered_at:
            self.delivered_at = timezone.now()
            update_fields = kwargs.get("update_fields")
            if update_fields is not None:
                kwargs["update_fields"] = list(set(update_fields) | {"delivered_at"})

        super().save(*args, **kwargs)

        kind = self.STATUS_EMAIL.get(self.status)
        if kind and prev_status != self.status:
            from apps.orders.emails import send_order_email_async

            order_id = self.pk
            transaction.on_commit(lambda: send_order_email_async(order_id, kind))

    # ---------- Create ----------
    @classmethod
    def create_from_cart(cls, cart, shipping_address, contact=None):
        from apps.products.models import ProductVariant
        from apps.orders.models import OrderItem
        user = cart.user
        contact = contact or {}

        # 1. Cart must belong to user
        if not cart.user:
            raise ValueError(
                "Cart must belong to an authenticated user."
            )

        # 2. Address must belong to user
        if shipping_address.user_id != cart.user_id:
            raise ValueError(
                "Shipping address does not belong to this user"
            )

        # 3. Get active cart items
        cart_items = list(
            cart.items.select_related(
                "variant",
                "variant__product"
            )
        )

        if not cart_items:
            raise ValueError(
                "Cannot create order from an empty cart"
            )

        with transaction.atomic():
            variant_ids = [
                item.variant_id
                for item in cart_items
            ]

            variants = (
                ProductVariant.objects
                .select_for_update()
                .filter(
                    id__in=variant_ids,
                    is_active=True
                )
            )

            variant_map = {
                variant.id: variant
                for variant in variants
            }

            # Stock validation
            for item in cart_items:
                variant = variant_map.get(item.variant_id)

                if not variant:
                    raise ValueError(
                        f"{item.variant_id} is no longer available."
                    )

                if variant.stock < item.quantity:
                    raise ValueError(
                        f"Only {variant.stock} quantity available "
                        f"for {variant.product.name}."
                    )


            # Address Snapshot
            shipping_snapshot = {
                "label": shipping_address.address_type,
                "line1": shipping_address.address_line1,
                "line2": shipping_address.address_line2 or "",
                "city": shipping_address.city.name if shipping_address.city else "",
                "state": shipping_address.state.name if shipping_address.state else "",
                "postal_code": str(shipping_address.pincode),
                "country": shipping_address.country.name if shipping_address.country else "",
            }

            # Calculate items total
            total_amount = sum (
                (
                    item.quantity *
                    variant_map[item.variant_id].price
                    for item in cart_items
                ),
                Decimal("0.00")
            )

            delivery_fee = cart.delivery_fee
            tax_amount = cart.tax_amount
            discount_amount = cart.discount_amount

            final_amount = (
                total_amount + delivery_fee + tax_amount - discount_amount
            )

            # Create order
            order = cls.objects.create(
                user = user,
                shipping_address = shipping_address,
                shipping_address_snapshot = shipping_snapshot,
                first_name=contact.get("first_name") or user.first_name,
                last_name=contact.get("last_name") or user.last_name,
                email=contact.get("email") or user.email,
                phone=contact.get("phone") or user.phone,
                total_amount = total_amount,
                delivery_fee = delivery_fee,
                tax_amount = tax_amount,
                discount_amount = discount_amount,
                final_amount = final_amount,   
            )

            # Create order items
            for item in cart_items:
                variant = variant_map[item.variant_id]

                OrderItem.objects.create(
                    order = order,
                    variant = variant,
                    product_name = variant.product.name,
                    variant_name = variant.size.name,
                    quantity = item.quantity,
                    price = variant.price
                )

                variant.stock -= item.quantity
                variant.save(update_fields=["stock"])
    
            # Cart clear
            cart.items.all().delete()

        return order

    # ---------- Cancel ----------
    @property
    def can_cancel(self):
        return self.status in self.CANCELLABLE

    def cancel(self, reason=""):
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=self.pk)

            if not order.can_cancel:
                raise ValueError("Order can no longer be cancelled.")

            order.status = "cancelled"
            order.cancelled_at = timezone.now()
            order.cancel_reason = (reason or "")[:255]
            order.save(update_fields=["status", "cancelled_at", "cancel_reason", "updated_at"])

            order._restock_items()

            session = getattr(order, "payment_session", None)
            if session and session.status in ("created", "attempted"):
                session.status = "expired"
                session.save(update_fields=["status", "updated_at"])

        self.status = order.status
        self.cancelled_at = order.cancelled_at
        self.cancel_reason = order.cancel_reason
        return order

    def _restock_items(self):
        items = list(self.items.exclude(variant__isnull=True))
        variants = {
            v.id: v
            for v in ProductVariant.objects.select_for_update().filter(
                id__in=[i.variant_id for i in items]
            )
        }
        for item in items:
            variant = variants[item.variant_id]
            variant.stock += item.quantity
            variant.save(update_fields=["stock"])

    def change_status(self, new_status):
        if new_status == self.status:
            return self

        if new_status == "cancelled":
            return self.cancel(reason="Cancelled by admin")

        allowed = self.ALLOWED_TRANSITIONS.get(self.status, set())
        if new_status not in allowed:
            raise ValueError(
                f"Cannot move order from '{self.status}' to '{new_status}'."
            )

        self.status = new_status
        self.save()
        return self

    # ---------- Return ----------
    @property
    def active_return(self):
        return self.returns.exclude(status="rejected").first()
    
    @property
    def can_return(self):
        if self.status != "delivered" or not self.delivered_at:
            return False

        window = timedelta(days=getattr(settings, "RETURN_WINDOW_DAYS", 7))
        if timezone.now() > self.delivered_at + window:
            return False

        return not self.returns.exclude(status="rejected").exists()

    def request_return(self, reason, comment=""):
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=self.pk)
            if not order.can_return:
                raise ValueError("This order cannot be returned.")
            return OrderReturn.objects.create(
                order=order, reason=reason, comment=comment
            )

class OrderReturn(models.Model):
    STATUS_CHOICES = [
        ("requested", "Requested"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("picked_up", "Picked up"),
        ("received", "Received"),
        ("refunded", "Refunded"),
    ]

    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="returns")
    reason = models.CharField(max_length=100)
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")
    admin_note = models.TextField(blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Return for Order #{self.order_id} - {self.status}"

    def mark_refunded(self):
        """Refund API success hone ke baad call karo."""
        with transaction.atomic():
            ret = OrderReturn.objects.select_for_update().get(pk=self.pk)
            if ret.status == "refunded":
                return ret

            ret.status = "refunded"
            ret.refund_amount = ret.refund_amount or ret.order.final_amount
            ret.save(update_fields=["status", "refund_amount", "updated_at"])

            order = Order.objects.select_for_update().get(pk=ret.order_id)
            order.status = "returned"
            order.save(update_fields=["status", "updated_at"])
            order._restock_items()  # sirf agar item resell karte ho, warna hata do

        self.status = "refunded"
        return ret

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items"
    )

    # Product Snapshot
    product_name = models.CharField(max_length=255)
    variant_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(
        validators=[
                MinValueValidator(1)
            ]
        )
    price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def subtotal(self):
        return self.quantity * self.price

    def __str__(self):
        return (
            f"{self.quantity} x "
            f"{self.product_name} "
            f"({self.variant_name}) "
            f"in Order #{self.order.id}"
        )