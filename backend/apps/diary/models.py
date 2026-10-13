from django.db import models
from django.conf import settings
from apps.products.models import Product
from apps.recipes.models import Recipe

class DiaryEntry(models.Model):
    MEAL_CHOICES = (
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diary_entries')
    date = models.DateField(db_index=True)
    meal_type = models.CharField(max_length=20, choices=MEAL_CHOICES, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    amount_g = models.FloatField(default=0.0)
    servings = models.FloatField(default=1.0)
    calories = models.FloatField(default=0.0)
    proteins = models.FloatField(default=0.0)
    fats = models.FloatField(default=0.0)
    carbs = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'created_at']
        indexes = [
            models.Index(fields=['user', 'date']),
        ]

class WeightEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='weight_entries')
    date = models.DateField(db_index=True)
    weight_kg = models.FloatField()
    note = models.CharField(max_length=255, blank=True, default='')

    class Meta:
        ordering = ['date']
        unique_together = ('user', 'date')
