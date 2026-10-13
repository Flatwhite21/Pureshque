from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WeightViewSet

router = DefaultRouter()
router.register(r'', WeightViewSet, basename='weight')

urlpatterns = [
    path('', include(router.urls)),
]
