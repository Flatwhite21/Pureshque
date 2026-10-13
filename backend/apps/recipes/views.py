from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Recipe

class RecipeListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        recipes = Recipe.objects.all().values()
        return Response(list(recipes))
