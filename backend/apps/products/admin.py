from django.contrib import admin
from unfold.admin import ModelAdmin
from apps.products.models import Category, Tag, Ingredient, Product, Size, ProductVariant
from django import forms
from django.db import models
from django.utils.html import format_html
from django.urls import reverse, path
from django.utils.safestring import mark_safe
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ["id", "name", "slug", "created_at", "updated_at"]
    fields = ["name", "slug"]
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Tag)
class TagAdmin(ModelAdmin):
    list_display = ["id", "name", "slug", "created_at", "updated_at"]
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Ingredient)
class IngredientAdmin(ModelAdmin):
    list_display = ["id", "name", "created_at", "updated_at"]

@admin.register(Size)
class SizeAdmin(ModelAdmin):
    list_display = ["id", "name", "created_at", "updated_at"]

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    fields = ['sku', 'size', 'price', 'stock']

    def get_extra(self, request, obj=None, **kwargs):
        if obj:
            return 0 # Not displayed any fields on the edit page
        return 1 # only 1 field diaplayed on add page

    # Edit page on all fields are display in read only
    # def get_readonly_fields(self, request, obj=None):
    #     if obj:
    #         # Listed here all fields which you want to locked
    #         # Ex: ['sku', 'price', 'stock', 'size', 'color']
    #         return [field.name for field in self.model._meta.fields if field.name not in ['id', 'stock', 'price']]
    #     return []

    # # If you want to not deleted old varients
    # def has_delete_permission(self, request, obj=None):
    #     if obj:
    #         return False # Old varients are not deleted
    #     return True

    # # If you want to dynamically render the variant form on edit and add page
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        
        class ClosureForm(formset.form):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                if self.instance and self.instance.pk:
                    for field_name in self.fields:
                        if field_name not in ['id', 'stock', 'price']:
                            self.fields[field_name].disabled = True
        
        formset.form = ClosureForm
        return formset

# -------------------------
# Product Admin Module
# -------------------------

@admin.register(Product)
class ProductAdmin(ModelAdmin):
    class Media:
        css = {
            'all': ('https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/css/select2.min.css',)
        }

        js = (
            'https://cdn.jsdelivr.net/npm/select2@4.1.0/dist/js/select2.min.js',
            'js/admin_select2.js'
        )

    list_display = ["display_variants", "display_image", "category", "name", "is_active", "created_at", "updated_at", "action_buttons"]
    fields = ["category", "name", "short_description", "description", "ingredients", "tags", "image"]
    inlines = [ProductVariantInline]

    list_display_links = None

    list_editable = ['is_active']

    search_fields = ("name", "category__name", "slug", "variants__sku")

    list_filter = ("is_deleted", "is_active", "created_at")

    list_per_page = 10

    # formfield_overrides = {
    #     models.ManyToManyField: {'widget': forms.CheckboxSelectMultiple}
    # }

    # -------------------------
    # Preview the Image
    # -------------------------
    def display_image(self, obj):
        if obj.image: # Checked image uploaded or not
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"/>', obj.image.url)
        return "No Image"

    # Set column name in Admin Panel
    display_image.short_description = "Image Preview"

    # -------------------------
    # Custom Action buttons (Edit, Delete)
    # -------------------------
    def action_buttons(self, obj):
        if obj.is_deleted:
            # IF Record deleted, display the Restore button
            restore_url = reverse('admin:products_product_restore', args=[obj.id])
            return format_html(
                '<a class="button restore-btn" href="{}" style="background-color: #28a745; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none;">Restore</a>',
                restore_url
            )
        # 1. Edit url
        edit_url = reverse('admin:products_product_change', args=[obj.id])

        # 2. Delete url
        delete_url = reverse('admin:products_product_delete', args=[obj.id])

        return format_html(
            '<a class="button" href="{}" style="background-color: #417690; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; margin-right: 5px;">Edit</a>'
            '<a class="button" href="{}" style="background-color: #ba2121; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none;">Delete</a>',
            edit_url, delete_url
        )
    action_buttons.short_description = 'Actions'

    # -------------------------
    # Variants Expand/Collapse
    # -------------------------
    def display_variants(self, obj):

        variants = obj.variants.all()

        if not variants.exists():
            return mark_safe(
                '<span style="color:#999;">No Variants</span>'
            )

        rows = ""

        for variant in variants:

            sku = variant.sku or "-"

            size = (
                variant.size.name
                if variant.size
                else "-"
            )

            rows += f"""
            <tr>
                <td>{sku}</td>
                <td>{size}</td>
                <td>₹{variant.price}</td>
                <td>{variant.stock}</td>
            </tr>
            """

        return mark_safe(
            f"""
            <div>

                <button
                    type="button"
                    class="variant-toggle-btn"
                    data-id="{obj.id}"
                    style="
                        background:#417690;
                        color:white;
                        border:none;
                        border-radius:4px;
                        padding:4px 10px;
                        cursor:pointer;
                    "
                >
                    +
                </button>

                <div
                    id="variant-wrapper-{obj.id}"
                    style="
                        display:none;
                        margin-top:10px;
                        background:white;
                        border:1px solid #ddd;
                        border-radius:6px;
                        padding:10px;
                    "
                >

                    <table
                        style="
                            width:100%;
                            border-collapse:collapse;
                            font-size:12px;
                        "
                    >

                        <thead>
                            <tr style="background:#f5f5f5;">
                                <th style="padding:6px;">SKU</th>
                                <th style="padding:6px;">Size</th>
                                <th style="padding:6px;">Price</th>
                                <th style="padding:6px;">Stock</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows}
                        </tbody>

                    </table>

                </div>

            </div>
            """
        )

    display_variants.short_description = "Variants"

    # -------------------------
    # Get the soft deleted or not records
    # -------------------------
    def get_queryset(self, request):
        # return self.model.objects.get_queryset()

        qs = self.model.all_objects.get_queryset()

        if request.GET.get("is_deleted__exact") is None:
            qs = self.model.objects.get_queryset()

        return qs

    def delete_model(self, request, obj):
        from django.utils import timezone
        if obj.is_deleted:
            obj.delete(hard_delete=True)
        else:
            obj.variants.update(is_active=False)
            obj.is_deleted = True
            obj.deleted_at = timezone.now()
            obj.save(update_fields=["is_deleted", "deleted_at"])

        self.message_user(request, "Product deleted successfully.")

    # -------------------------
    # Handle Default Bulk Action
    # -------------------------
    def delete_queryset(self, request, queryset):
        from django.utils import timezone

        soft_delete = queryset.filter(is_deleted=False)
        hard_delete = queryset.filter(is_deleted=True)

        # Soft delete
        for obj in soft_delete:
            obj.variants.update(is_active=False)
        soft_delete.update(is_deleted=True, deleted_at=timezone.now())

        # Hard delete
        hard_delete.delete()

        self.message_user(
            request,
            "Selected products deleted successfully."
        )

    # -------------------------
    # Create Custom URL Path
    # -------------------------
    def get_urls(self):
        urls = super().get_urls()

        custom_urls = [
            path(
                "<int:product_id>/restore/",
                self.admin_site.admin_view(self.restore_view),
                name="products_product_restore",
            ),
        ]

        return custom_urls + urls

    # -------------------------
    # Product Restore logic
    # -------------------------
    def restore_view(self, request, product_id):

        product = get_object_or_404(
            Product.all_objects,
            pk=product_id,
            is_deleted=True
        )

        # Product restore
        product.restore()

        # Product ke variants active
        product.variants.update(is_active=True)

        self.message_user(
            request,
            f"Product '{product.name}' restored successfully.",
            messages.SUCCESS
        )

        return redirect("admin:products_product_changelist")