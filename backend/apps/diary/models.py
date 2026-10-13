from django.db import models
from django.conf import settings
from apps.products.models import Product
from apps.recipes.models import Recipe

class DiaryEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diary_entries')
    date = models.DateField(db_index=True)
    meal_type = models.CharField(max_length=20)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, null=True, blank=True)
    amount_g = models.FloatField(null=True, blank=True)
    servings = models.FloatField(null=True, blank=True)
    calories = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    carbs = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

class WeightEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='weight_entries')
    date = models.DateField(db_index=True)
    weight_kg = models.FloatField()
    note = models.CharField(max_length=255, blank=True)
