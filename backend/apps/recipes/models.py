from django.db import models
from django.conf import settings
from apps.products.models import Product

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes', null=True, blank=True)
    servings = models.PositiveIntegerField(default=1)
    total_weight_g = models.FloatField(default=0)
    total_calories = models.FloatField(default=0)
    total_proteins = models.FloatField(default=0)
    total_fats = models.FloatField(default=0)
    total_carbs = models.FloatField(default=0)
    calories_per_100g = models.FloatField(default=0)
    proteins_per_100g = models.FloatField(default=0)
    fats_per_100g = models.FloatField(default=0)
    carbs_per_100g = models.FloatField(default=0)
    calories_per_serving = models.FloatField(default=0)
    proteins_per_serving = models.FloatField(default=0)
    fats_per_serving = models.FloatField(default=0)
    carbs_per_serving = models.FloatField(default=0)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    amount_g = models.FloatField()
    calories = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    carbs = models.FloatField()
