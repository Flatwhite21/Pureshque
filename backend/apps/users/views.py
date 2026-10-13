from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Profile
from .serializers import UserSerializer, RegisterSerializer, ProfileSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

class ProfileNormView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        profile = request.user.profile
        # Mifflin-St Jeor Formula
        base = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age
        bmr = base + 5 if profile.gender == 'male' else base - 161

        activity_map = {'min': 1.2, 'low': 1.375, 'medium': 1.55, 'high': 1.725, 'very_high': 1.9}
        tdee = bmr * activity_map.get(profile.activity_level, 1.375)

        if profile.goal == 'lose':
            target_calories = round(tdee * 0.8)
        elif profile.goal == 'gain':
            target_calories = round(tdee * 1.15)
        else:
            target_calories = round(tdee)

        proteins = round(profile.weight_kg * 1.8)
        fats = round(profile.weight_kg * 0.9)
        carbs = max(0, round((target_calories - proteins * 4 - fats * 9) / 4))

        return Response({
            'bmr': round(bmr),
            'tdee': round(tdee),
            'target_calories': target_calories,
            'proteins': proteins,
            'fats': fats,
            'carbs': carbs,
            'goal': profile.goal,
        })
