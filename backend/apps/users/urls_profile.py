from django.urls import path
from .views import ProfileView, ProfileNormView

urlpatterns = [
    path('', ProfileView.as_view(), name='profile_detail'),
    path('norm/', ProfileNormView.as_view(), name='profile_norm'),
]
