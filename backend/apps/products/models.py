from django.db import models
from django.conf import settings

class Product(models.Model):
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    calories_per_100g = models.FloatField(db_index=True)
    proteins_per_100g = models.FloatField()
    fats_per_100g = models.FloatField()
    carbs_per_100g = models.FloatField()
    category = models.CharField(max_length=50, default='other')
    is_global = models.BooleanField(default=False, db_index=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    source = models.CharField(max_length=20, default='manual')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
