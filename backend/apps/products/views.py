from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category']

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get('category')
        qs = Product.objects.filter(Q(is_global=True) | Q(owner=user))
        if category:
            qs = qs.filter(category=category)
        return qs

    def perform_destroy(self, instance):
        if instance.is_global and not self.request.user.is_staff:
            raise permissions.exceptions.PermissionDenied("Нельзя удалять глобальные продукты")
        instance.delete()
