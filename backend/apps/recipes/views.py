from rest_framework import viewsets, permissions, decorators, response
from django.db.models import Q
from .models import Recipe
from .serializers import RecipeSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Recipe.objects.filter(Q(is_public=True) | Q(author=user)).prefetch_related('ingredients__product')

    @decorators.action(detail=False, methods=['get'])
    def my(self, request):
        recipes = Recipe.objects.filter(author=request.user)
        serializer = self.get_serializer(recipes, many=True)
        return response.Response(serializer.data)

    @decorators.action(detail=True, methods=['post'])
    def calculate(self, request, pk=None):
        recipe = self.get_object()
        recipe.calculate_nutrition()
        recipe.save()
        return response.Response(self.get_serializer(recipe).data)
