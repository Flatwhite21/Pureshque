from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date, timedelta
from django.db.models import Sum, Avg
from apps.diary.models import DiaryEntry, WeightEntry

class AnalyticsCaloriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        days = int(request.query_params.get('period', 7))
        start_date = date.today() - timedelta(days=days)

        entries = DiaryEntry.objects.filter(user=user, date__gte=start_date)
        by_date = {}
        for e in entries:
            d_str = e.date.isoformat()
            by_date[d_str] = by_date.get(d_str, 0) + e.calories

        norm = user.profile.daily_calorie_norm if hasattr(user, 'profile') else 1800

        data = [
            {'date': d, 'calories': round(c), 'norm': norm}
            for d, c in sorted(by_date.items())
        ]
        return Response(data)

class AnalyticsMacrosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        days = int(request.query_params.get('period', 7))
        start_date = date.today() - timedelta(days=days)

        entries = DiaryEntry.objects.filter(user=user, date__gte=start_date)
        total_p = sum(e.proteins for e in entries)
        total_f = sum(e.fats for e in entries)
        total_c = sum(e.carbs for e in entries)
        count = max(1, len(set(e.date for e in entries)))

        avg_p = round(total_p / count, 1)
        avg_f = round(total_f / count, 1)
        avg_c = round(total_c / count, 1)
        total_cals = avg_p * 4 + avg_f * 9 + avg_c * 4 or 1

        return Response({
            'avg_proteins': avg_p,
            'avg_fats': avg_f,
            'avg_carbs': avg_c,
            'percent_proteins': round((avg_p * 4 / total_cals) * 100),
            'percent_fats': round((avg_f * 9 / total_cals) * 100),
            'percent_carbs': round((avg_c * 4 / total_cals) * 100),
        })

class AnalyticsStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        days = int(request.query_params.get('period', 7))
        start_date = date.today() - timedelta(days=days)

        entries = DiaryEntry.objects.filter(user=user, date__gte=start_date)
        by_date = {}
        for e in entries:
            d_str = e.date.isoformat()
            by_date[d_str] = by_date.get(d_str, 0) + e.calories

        values = list(by_date.values()) or [0]
        return Response({
            'average_calories': round(sum(values) / len(values)),
            'max_calories': round(max(values)),
            'min_calories': round(min(values)),
            'days_tracked': len(values),
        })
