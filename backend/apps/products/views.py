from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Product

class ProductListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        products = Product.objects.all().values()
        return Response(list(products))
