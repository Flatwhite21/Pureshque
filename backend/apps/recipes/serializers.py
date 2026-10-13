from rest_framework import serializers
from .models import Recipe, RecipeIngredient
from apps.products.serializers import ProductSerializer

class RecipeIngredientSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = RecipeIngredient
        fields = ('id', 'product', 'product_name', 'amount_g', 'calories', 'proteins', 'fats', 'carbs')
        read_only_fields = ('id', 'calories', 'proteins', 'fats', 'carbs')

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True, required=False)
    author_name = serializers.ReadOnlyField(source='author.first_name')

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = (
            'id', 'author', 'author_name', 'total_weight_g', 'total_calories',
            'total_proteins', 'total_fats', 'total_carbs', 'calories_per_100g',
            'proteins_per_100g', 'fats_per_100g', 'carbs_per_100g',
            'calories_per_serving', 'proteins_per_serving', 'fats_per_serving',
            'carbs_per_serving', 'created_at', 'updated_at'
        )

    def create(self, validated_data):
        ingredients_data = self.context['request'].data.get('ingredients', [])
        recipe = Recipe.objects.create(author=self.context['request'].user, **validated_data)
        for item in ingredients_data:
            RecipeIngredient.objects.create(
                recipe=recipe,
                product_id=item['product_id'],
                amount_g=item['amount_g']
            )
        recipe.calculate_nutrition()
        recipe.save()
        return recipe
