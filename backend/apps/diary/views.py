from rest_framework import viewsets, permissions, decorators, response
from datetime import date
from .models import DiaryEntry, WeightEntry
from .serializers import DiaryEntrySerializer, WeightEntrySerializer

class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        target_date = self.request.query_params.get('date', date.today().isoformat())
        return DiaryEntry.objects.filter(user=user, date=target_date)

    @decorators.action(detail=False, methods=['get'])
    def summary(self, request):
        user = request.user
        target_date = request.query_params.get('date', date.today().isoformat())
        entries = DiaryEntry.objects.filter(user=user, date=target_date)

        total_calories = sum(e.calories for e in entries)
        total_proteins = sum(e.proteins for e in entries)
        total_fats = sum(e.fats for e in entries)
        total_carbs = sum(e.carbs for e in entries)

        return response.Response({
            'date': target_date,
            'total_calories': round(total_calories),
            'total_proteins': round(total_proteins, 1),
            'total_fats': round(total_fats, 1),
            'total_carbs': round(total_carbs, 1),
            'count': entries.count(),
        })

class WeightViewSet(viewsets.ModelViewSet):
    serializer_class = WeightEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WeightEntry.objects.filter(user=self.request.user).order_by('date')
