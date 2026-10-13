from django.urls import path
from .views import ExportRecipesXLSXView, ExportDiaryPDFView

urlpatterns = [
    path('recipes/xlsx/', ExportRecipesXLSXView.as_view(), name='export_recipes_xlsx'),
    path('diary/pdf/', ExportDiaryPDFView.as_view(), name='export_diary_pdf'),
]
