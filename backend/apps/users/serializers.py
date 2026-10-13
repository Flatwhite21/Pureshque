from rest_framework import serializers
from .models import User, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'provider', 'is_active', 'date_joined')
        read_only_fields = ('id', 'role', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        # Create default profile
        Profile.objects.create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
