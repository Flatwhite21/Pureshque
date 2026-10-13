from django.urls import path
from .views import WeightListView

urlpatterns = [
    path('', WeightListView.as_view(), name='weight_list'),
]
