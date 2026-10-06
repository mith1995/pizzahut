from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction, models
from django.utils import timezone
from apps.cart.models import Cart, CartItem
from apps.cart.serializers import CartSerializer, CartItemSerializer
from apps.products.models import ProductVariant

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return active carts"""
        return Cart.objects.filter(
            is_active=True
        )

    def get_or_create_cart(self, request):
        """Get or create active cart for user"""
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            defaults={'session_key': None}
        )
        return cart

    def list(self, request):
        cart = self.get_or_create_cart(request)
        serializer = CartSerializer(
            cart, 
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_or_create_cart(request)
        variant_id = request.data.get('variant_id')

        try:
            quantity = int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a valid integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate variant (must be active)
        try:
            variant = ProductVariant.objects.select_related('product').get(
                id=variant_id,
                is_active=True
            )
            if variant.stock < quantity:
                return Response(
                    {"error": f"Only {variant.stock} items available in stock"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ProductVariant.DoesNotExist:
            return Response(
                {"error": f"Variant not found or not available"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if item already exists in cart (active only)
        with transaction.atomic():
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                variant=variant,
                is_active=True,
                defaults={'quantity': quantity}
            )

            if not created:
                # Item exists → update quantity
                new_quantity = cart_item.quantity + quantity
                if new_quantity > variant.stock:
                    return Response(
                        {"error": f"Only {variant.stock} items available in stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = new_quantity
                cart_item.save()
        cart.refresh_from_db()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        cart = self.get_or_create_cart(request)
        variant_id = request.data.get('variant_id')
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = CartItem.objects.select_related('variant').get(
                cart=cart,
                variant_id=variant_id,
                is_active=True
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not in cart"},
                status=status.HTTP_404_NOT_FOUND
            )

        with transaction.atomic():
            if quantity <= 0:
                # Delete item
                cart_item.delete()
            else:
                if quantity > cart_item.variant.stock:
                    return Response(
                        {"error": f"Only {cart_item.variant.stock} items available"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = quantity
                cart_item.save()

        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart by variant_id"""
        cart = self.get_or_create_cart(request)
        variant_id = request.data.get('variant_id')

        deleted, _ = CartItem.objects.filter(
            cart=cart,
            variant_id=variant_id
        ).delete()

        if deleted == 0:
            return Response(
                {"error": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from cart"""
        cart = self.get_or_create_cart(request)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"})

    @action(detail=False, methods=['get'])
    def validate(self, request):
        """
        Validate cart - check stock availability
        Returns invalid items and suggestions
        """
        cart = self.get_or_create_cart(request)
        invalid_items = []

        for item in cart.items.all():
            if not item.is_available():
                invalid_items.append({
                    'variant_id': item.variant.id,
                    'product_name': item.variant.product.name,
                    'size': item.variant.get_size_display(),
                    'requested_quantity': item.quantity,
                    'available_stock': item.variant.stock,
                    'reason': 'Out of stock' if item.variant.stock <= 0 else 'Variant unavailable'
                })

        return Response({
            'is_valid': len(invalid_items) == 0,
            'invalid_items': invalid_items,
            'cart': CartSerializer(cart).data
        })

class GuestCartViewSet(viewsets.ViewSet):
    """
    Guest cart using session key
    LocalStorage alternative for better control
    """
    permission_classes = [AllowAny]

    def get_session_key(self, request):
        return request.session.session_key or request.session.create()

    def get_or_create_guest_cart(self, request):
        session_key = self.get_session_key(request)
        cart, created = Cart.objects.get_or_create(
            session_key = session_key,
            user=None,
            defaults={}
        )
        return cart, created

    def list(self, request):
        cart, _ = self.get_or_create_guest_cart(request)
        serializer = CartSerializer(
            cart,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart, _ = self.get_or_create_guest_cart(request)
        variant_id = request.data.get('variant_id')

        try:
            quantity = int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a valid integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity <= 0:
            return Response(
                {"error": "Quantity must be greater than zero"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            variant = ProductVariant.objects.get(id=variant_id, is_active=True)
            if variant.stock < quantity:
                return Response(
                    {"error": f"Only {variant.stock} items available"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ProductVariant.DoesNotExist:
            return Response(
                {"error": "Variant not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={'quantity': quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > variant.stock:
                return Response(
                    {"error": f"Only {variant.stock} items available"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()

        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Update quantity of an item in guest cart"""
        cart, _ = self.get_or_create_guest_cart(request)
        variant_id = request.data.get('variant_id')
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {"error": "Quantity is required"},
            )

        try:
            cart_item = CartItem.objects.select_related('variant').get(
                cart=cart,
                variant_id=variant_id
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not in cart"},
                status=status.HTTP_404_NOT_FOUND
            )

        with transaction.atomic():
            if quantity <= 0:
                cart_item.delete()
            else:
                if quantity > cart_item.variant.stock:
                    return Response(
                        {"error": f"Only {cart_item.variant.stock} items available"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = quantity
                cart_item.save()

        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from guest cart by variant_id"""
        cart, _ = self.get_or_create_guest_cart(request)
        variant_id = request.data.get('variant_id')

        deleted, _ = CartItem.objects.filter(
            cart=cart,
            variant_id=variant_id
        ).delete()

        if deleted == 0:
            return Response(
                {"error": "Item not found in cart"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart.refresh_from_db()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from guest cart"""
        cart, _ = self.get_or_create_guest_cart(request)
        cart.items.all().delete()
        return Response({"message": "Guest cart cleared"})

    @action(detail=False, methods=['get'])
    def validate(self, guest):
        """Validate guest cart - check stock availability"""
        cart, _ = self.get_or_create_guest_cart(self.request)
        invalid_items = []

        for item in cart.items.all():
            if not item.is_available():
                invalid_items.append({
                    'variant_id': item.variant.id,
                    'product_name': item.variant.product.name,
                    'size': item.variant.get_size_display(),
                    'requested_quantity': item.quantity,
                    'available_quantity': item.variant.stock,
                    'reason': "Out of stock" if item.variant.stock <=0 else 'Variant unavailable'
                })

        return Response({
            'is_valid': len(invalid_items) == 0,
            'invalid_items': invalid_items,
            'cart': CartSerializer(cart).data
        })

    @action(detail=False, methods=['post'])
    def merge_to_user(self, request):
        """
        Merge guest cart to authenticated user cart
        Call this after login
        """
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        guest_cart, _ = self.get_or_create_guest_cart(request)

        if guest_cart.items.exists():
            user_cart, _ = Cart.objects.get_or_create(user=request.user)

            with transaction.atomic():
                for guest_item in guest_cart.items.all():
                    cart_item, created = CartItem.objects.get_or_create(
                        cart=user_cart,
                        variant=guest_item.variant,
                        defaults={'quantity': guest_item.quantity}
                    )

                    if not created:
                        new_quantity = cart_item.quantity + guest_item.quantity
                        if new_quantity <= guest_item.variant.stock:
                            cart_item.quantity = new_quantity
                            cart_item.save()

                # Clear guest cart
                guest_cart.items.all().delete()
                guest_cart.delete()

            user_cart.refresh_from_db()
            serializer = CartSerializer(user_cart)
            return Response(serializer.data)
        return Response({"message": "No guest cart to merge"})