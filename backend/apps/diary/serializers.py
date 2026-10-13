from rest_framework import serializers
from .models import DiaryEntry, WeightEntry

class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = '__all__'
        read_only_fields = ('id', 'user', 'calories', 'proteins', 'fats', 'carbs', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data.get('product')
        recipe = validated_data.get('recipe')

        if product:
            amount_g = validated_data.get('amount_g', 100.0)
            factor = amount_g / 100.0
            validated_data['calories'] = round(product.calories_per_100g * factor, 1)
            validated_data['proteins'] = round(product.proteins_per_100g * factor, 1)
            validated_data['fats'] = round(product.fats_per_100g * factor, 1)
            validated_data['carbs'] = round(product.carbs_per_100g * factor, 1)
            validated_data['name'] = product.name
        elif recipe:
            servings = validated_data.get('servings', 1.0)
            validated_data['calories'] = round(recipe.calories_per_serving * servings, 1)
            validated_data['proteins'] = round(recipe.proteins_per_serving * servings, 1)
            validated_data['fats'] = round(recipe.fats_per_serving * servings, 1)
            validated_data['carbs'] = round(recipe.carbs_per_serving * servings, 1)
            validated_data['amount_g'] = round((recipe.total_weight_g / recipe.servings) * servings, 1)
            validated_data['name'] = f"{recipe.title} ({servings} порц.)"

        return DiaryEntry.objects.create(user=user, **validated_data)

class WeightEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightEntry
        fields = '__all__'
        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        user = self.context['request'].user
        return WeightEntry.objects.create(user=user, **validated_data)
