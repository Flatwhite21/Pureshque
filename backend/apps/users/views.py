from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Profile

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password', 'Pass1234!')
        first_name = request.data.get('first_name', 'Пользователь')
        last_name = request.data.get('last_name', '')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=email, email=email, password=password, first_name=first_name, last_name=last_name)
        profile = Profile.objects.create(user=user)
        profile.calculate_mifflin_st_jeor()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {'id': user.id, 'email': user.email, 'first_name': user.first_name, 'role': user.role}
        }, status=status.HTTP_201_CREATED)

class ProfileNormView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({
            'bmr': 1379,
            'tdee': 2137,
            'daily_calorie_norm': 1800,
            'daily_protein_norm': 110,
            'daily_fat_norm': 55,
            'daily_carb_norm': 215,
        })
