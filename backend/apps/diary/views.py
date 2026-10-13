from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import DiaryEntry, WeightEntry

class DiaryListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        entries = DiaryEntry.objects.all().values()
        return Response(list(entries))

class WeightListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        weights = WeightEntry.objects.all().values()
        return Response(list(weights))
