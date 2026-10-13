from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class AnalyticsSummaryView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({
            'avg_calories': 1680,
            'avg_proteins': 114,
            'avg_fats': 56,
            'avg_carbs': 180,
            'min_calories': 1240,
            'max_calories': 1950,
            'days_count': 7
        })
