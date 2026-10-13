from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'Пользователь'),
        ('admin', 'Администратор'),
    )
    PROVIDER_CHOICES = (
        ('email', 'Email'),
        ('vk', 'ВКонтакте'),
        ('yandex', 'Яндекс'),
    )

    email = models.EmailField(unique=True, verbose_name="Email")
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='email')
    email_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"


class Profile(models.Model):
    GENDER_CHOICES = (('male', 'Мужской'), ('female', 'Женский'))
    ACTIVITY_CHOICES = (
        ('min', 'Минимальная (1.2)'),
        ('low', 'Низкая (1.375)'),
        ('medium', 'Средняя (1.55)'),
        ('high', 'Высокая (1.725)'),
        ('very_high', 'Очень высокая (1.9)'),
    )
    GOAL_CHOICES = (
        ('lose', 'Снижение веса (-20%)'),
        ('maintain', 'Поддержание'),
        ('gain', 'Набор массы (+15%)'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='female')
    age = models.PositiveIntegerField(default=25)
    height_cm = models.FloatField(default=170.0)
    weight_kg = models.FloatField(default=65.0)
    activity_level = models.CharField(max_length=15, choices=ACTIVITY_CHOICES, default='medium')
    goal = models.CharField(max_length=15, choices=GOAL_CHOICES, default='lose')
    
    daily_calorie_norm = models.PositiveIntegerField(default=1800)
    daily_protein_norm = models.FloatField(default=110.0)
    daily_fat_norm = models.FloatField(default=55.0)
    daily_carb_norm = models.FloatField(default=215.0)

    timezone = models.CharField(max_length=50, default='Europe/Moscow')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_mifflin_st_jeor(self):
        """Формула Миффлина-Сан Жеора"""
        base = 10 * self.weight_kg + 6.25 * self.height_cm - 5 * self.age
        bmr = base + 5 if self.gender == 'male' else base - 161
        
        mults = {'min': 1.2, 'low': 1.375, 'medium': 1.55, 'high': 1.725, 'very_high': 1.9}
        tdee = bmr * mults.get(self.activity_level, 1.2)
        
        if self.goal == 'lose':
            calories = round(tdee * 0.8)
        elif self.goal == 'gain':
            calories = round(tdee * 1.15)
        else:
            calories = round(tdee)
            
        proteins = round(self.weight_kg * (1.8 if self.goal == 'maintain' else 2.0))
        fats = round(self.weight_kg * (0.9 if self.goal == 'lose' else 1.0))
        carbs = max(0, round((calories - proteins * 4 - fats * 9) / 4))
        
        self.daily_calorie_norm = calories
        self.daily_protein_norm = proteins
        self.daily_fat_norm = fats
        self.daily_carb_norm = carbs
        self.save()
        return calories, proteins, fats, carbs
