from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (('user', 'Пользователь'), ('admin', 'Администратор'))
    PROVIDER_CHOICES = (('email', 'Email'), ('vk', 'ВКонтакте'), ('yandex', 'Яндекс'))

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='email')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

class Profile(models.Model):
    GENDER_CHOICES = (('male', 'Мужской'), ('female', 'Женский'))
    ACTIVITY_CHOICES = (
        ('min', '1.2 - Минимальная'),
        ('low', '1.375 - Низкая'),
        ('medium', '1.55 - Средняя'),
        ('high', '1.725 - Высокая'),
        ('very_high', '1.9 - Очень высокая'),
    )
    GOAL_CHOICES = (
        ('lose', 'Снижение веса (-20%)'),
        ('maintain', 'Поддержание'),
        ('gain', 'Набор массы (+15%)'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='female')
    age = models.PositiveIntegerField(default=26)
    height_cm = models.FloatField(default=168.0)
    weight_kg = models.FloatField(default=62.0)
    activity_level = models.CharField(max_length=20, choices=ACTIVITY_CHOICES, default='medium')
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='lose')
    daily_calorie_norm = models.PositiveIntegerField(default=1800)
    daily_protein_norm = models.PositiveIntegerField(default=110)
    daily_fat_norm = models.PositiveIntegerField(default=55)
    daily_carb_norm = models.PositiveIntegerField(default=215)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    timezone = models.CharField(max_length=50, default='Europe/Moscow')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Профиль {self.user.email}"
