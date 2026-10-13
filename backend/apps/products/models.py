from django.db import models
from django.conf import settings

class Product(models.Model):
    SOURCE_CHOICES = (
        ('manual', 'Вручную'),
        ('external', 'Внешняя база (OpenFoodFacts/USDA)'),
        ('admin', 'Администратор'),
    )

    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, default='')
    calories_per_100g = models.FloatField()
    proteins_per_100g = models.FloatField(default=0.0)
    fats_per_100g = models.FloatField(default=0.0)
    carbs_per_100g = models.FloatField(default=0.0)
    category = models.CharField(max_length=100, db_index=True)
    is_global = models.BooleanField(default=False, db_index=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='products')
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='manual')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name', 'category']),
        ]

    def __str__(self):
        return f"{self.name} ({self.calories_per_100g} ккал)"
