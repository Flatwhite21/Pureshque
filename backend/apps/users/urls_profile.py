from django.urls import path
from .views import ProfileNormView

urlpatterns = [
    path('norm/', ProfileNormView.as_view(), name='profile_norm'),
]
