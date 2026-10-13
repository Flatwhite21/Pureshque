from django.urls import path
from .views import AnalyticsCaloriesView, AnalyticsMacrosView, AnalyticsStatisticsView

urlpatterns = [
    path('calories/', AnalyticsCaloriesView.as_view(), name='analytics_calories'),
    path('macros/', AnalyticsMacrosView.as_view(), name='analytics_macros'),
    path('statistics/', AnalyticsStatisticsView.as_view(), name='analytics_statistics'),
]
