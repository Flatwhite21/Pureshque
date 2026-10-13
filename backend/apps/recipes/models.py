from django.db import models
from django.conf import settings
from apps.products.models import Product

class Recipe(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default='')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')
    servings = models.PositiveIntegerField(default=1)
    total_weight_g = models.FloatField(default=0.0)
    total_calories = models.FloatField(default=0.0)
    total_proteins = models.FloatField(default=0.0)
    total_fats = models.FloatField(default=0.0)
    total_carbs = models.FloatField(default=0.0)

    calories_per_100g = models.FloatField(default=0.0)
    proteins_per_100g = models.FloatField(default=0.0)
    fats_per_100g = models.FloatField(default=0.0)
    carbs_per_100g = models.FloatField(default=0.0)

    calories_per_serving = models.FloatField(default=0.0)
    proteins_per_serving = models.FloatField(default=0.0)
    fats_per_serving = models.FloatField(default=0.0)
    carbs_per_serving = models.FloatField(default=0.0)

    image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    is_public = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def calculate_nutrition(self):
        ingredients = self.ingredients.all()
        total_weight = sum(item.amount_g for item in ingredients)
        total_cals = sum(item.calories for item in ingredients)
        total_p = sum(item.proteins for item in ingredients)
        total_f = sum(item.fats for item in ingredients)
        total_c = sum(item.carbs for item in ingredients)

        self.total_weight_g = round(total_weight, 1)
        self.total_calories = round(total_cals, 1)
        self.total_proteins = round(total_p, 1)
        self.total_fats = round(total_f, 1)
        self.total_carbs = round(total_c, 1)

        safe_weight = max(1.0, total_weight)
        safe_servings = max(1, self.servings)

        self.calories_per_100g = round((total_cals / safe_weight) * 100, 1)
        self.proteins_per_100g = round((total_p / safe_weight) * 100, 1)
        self.fats_per_100g = round((total_f / safe_weight) * 100, 1)
        self.carbs_per_100g = round((total_c / safe_weight) * 100, 1)

        self.calories_per_serving = round(total_cals / safe_servings, 1)
        self.proteins_per_serving = round(total_p / safe_servings, 1)
        self.fats_per_serving = round(total_f / safe_servings, 1)
        self.carbs_per_serving = round(total_c / safe_servings, 1)

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount_g = models.FloatField()
    calories = models.FloatField(default=0.0)
    proteins = models.FloatField(default=0.0)
    fats = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        factor = self.amount_g / 100.0
        self.calories = round(self.product.calories_per_100g * factor, 1)
        self.proteins = round(self.product.proteins_per_100g * factor, 1)
        self.fats = round(self.product.fats_per_100g * factor, 1)
        self.carbs = round(self.product.carbs_per_100g * factor, 1)
        super().save(*args, **kwargs)
