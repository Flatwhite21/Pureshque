from django.urls import path
from .views import ExportTaskStatusView

urlpatterns = [
    path('status/', ExportTaskStatusView.as_view(), name='export_status'),
]
