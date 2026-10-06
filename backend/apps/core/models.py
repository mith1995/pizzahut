from django.db import models
from django.utils import timezone

# ==========================================
# 1. CUSTOM QUERY_SET
# ==========================================
class SoftDeleteQuerySet(models.QuerySet):
    def delete(self):
        return super().update(is_deleted=True, deleted_at=timezone.now())
    
# ==========================================
# 2. CUSTOM MANAGER
# ==========================================
class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)
    

# ==========================================
# 3. BASE MODEL (With TimeStamps & Soft Delete)
# ==========================================
class SoftDeleteModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Time")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Last Updated")

    is_deleted = models.BooleanField(default=False, verbose_name="Deleted")
    deleted_at = models.DateTimeField(blank=True, null=True, verbose_name="Deleted Time")

    objects = SoftDeleteManager() # Only Active Data for (e.g. Book.objects.all())
    all_objects = models.Manager() # Get all recored with Soft Deleted (e.g. Book.all_objects.all())

    class Meta:
        abstract = True # Does not exists table's name in the Database

    # Override the Default delete()
    def delete(self, *args, **kwargs):
        hard_delete = kwargs.pop("hard_delete", False)
        if hard_delete:
            return super().delete(*args, **kwargs)
        
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    # Restore the soft deleted recored
    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()