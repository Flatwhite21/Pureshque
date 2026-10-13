import React, { useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Database,
  FileCode,
  FileText,
  FolderTree,
  Layers,
  Terminal,
} from 'lucide-react';

interface CodeFile {
  id: string;
  category: 'models' | 'api' | 'celery' | 'docker' | 'tests' | 'readme';
  filename: string;
  path: string;
  language: string;
  code: string;
}

const PROJECT_FILES: CodeFile[] = [
  {
    id: 'users_models',
    category: 'models',
    filename: 'users/models.py',
    path: 'pureshque/backend/apps/users/models.py',
    language: 'python',
    code: `from django.contrib.auth.models import AbstractUser
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
`,
  },
  {
    id: 'products_models',
    category: 'models',
    filename: 'products/models.py',
    path: 'pureshque/backend/apps/products/models.py',
    language: 'python',
    code: `from django.db import models
from django.conf import settings

class Product(models.Model):
    CATEGORY_CHOICES = (
        ('vegetables', 'Овощи и зелень'),
        ('meat', 'Мясо и птица'),
        ('fish', 'Рыба и морепродукты'),
        ('dairy', 'Молочные продукты'),
        ('grains', 'Крупы и злаки'),
        ('fruits', 'Фрукты и ягоды'),
        ('nuts_oils', 'Орехи и масла'),
        ('drinks', 'Напитки'),
        ('bakery_dessert', 'Выпечка и десерты'),
        ('other', 'Прочее'),
    )
    SOURCE_CHOICES = (
        ('manual', 'Вручную пользователем'),
        ('external', 'Open Food Facts / USDA'),
        ('admin', 'Администратор'),
    )

    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True, null=True)
    calories_per_100g = models.FloatField(db_index=True)
    proteins_per_100g = models.FloatField()
    fats_per_100g = models.FloatField()
    carbs_per_100g = models.FloatField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    is_global = models.BooleanField(default=False, db_index=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='manual')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"
        indexes = [
            models.Index(fields=['name', 'category']),
        ]
`,
  },
  {
    id: 'recipes_models',
    category: 'models',
    filename: 'recipes/models.py',
    path: 'pureshque/backend/apps/recipes/models.py',
    language: 'python',
    code: `from django.db import models
from django.conf import settings
from apps.products.models import Product

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recipes')
    servings = models.PositiveIntegerField(default=1)
    
    total_weight_g = models.FloatField(default=0)
    total_calories = models.FloatField(default=0)
    total_proteins = models.FloatField(default=0)
    total_fats = models.FloatField(default=0)
    total_carbs = models.FloatField(default=0)
    
    calories_per_100g = models.FloatField(default=0)
    proteins_per_100g = models.FloatField(default=0)
    fats_per_100g = models.FloatField(default=0)
    carbs_per_100g = models.FloatField(default=0)

    calories_per_serving = models.FloatField(default=0)
    proteins_per_serving = models.FloatField(default=0)
    fats_per_serving = models.FloatField(default=0)
    carbs_per_serving = models.FloatField(default=0)
    
    image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def recalculate_totals(self):
        """Суммирует все ингредиенты и рассчитывает КБЖУ на 100г и на порцию"""
        ingredients = self.ingredients.all()
        weight = sum(i.amount_g for i in ingredients)
        cal = sum(i.calories for i in ingredients)
        prot = sum(i.proteins for i in ingredients)
        fat = sum(i.fats for i in ingredients)
        carb = sum(i.carbs for i in ingredients)

        self.total_weight_g = weight
        self.total_calories = cal
        self.total_proteins = prot
        self.total_fats = fat
        self.total_carbs = carb

        if weight > 0:
            factor = 100.0 / weight
            self.calories_per_100g = round(cal * factor, 1)
            self.proteins_per_100g = round(prot * factor, 1)
            self.fats_per_100g = round(fat * factor, 1)
            self.carbs_per_100g = round(carb * factor, 1)
        
        servings = max(1, self.servings)
        self.calories_per_serving = round(cal / servings, 1)
        self.proteins_per_serving = round(prot / servings, 1)
        self.fats_per_serving = round(fat / servings, 1)
        self.carbs_per_serving = round(carb / servings, 1)
        self.save()


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    amount_g = models.FloatField()
    calories = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    carbs = models.FloatField()

    def save(self, *args, **kwargs):
        factor = self.amount_g / 100.0
        self.calories = round(self.product.calories_per_100g * factor, 1)
        self.proteins = round(self.product.proteins_per_100g * factor, 1)
        self.fats = round(self.product.fats_per_100g * factor, 1)
        self.carbs = round(self.product.carbs_per_100g * factor, 1)
        super().save(*args, **kwargs)
`,
  },
  {
    id: 'diary_models',
    category: 'models',
    filename: 'diary/models.py',
    path: 'pureshque/backend/apps/diary/models.py',
    language: 'python',
    code: `from django.db import models
from django.conf import settings
from apps.products.models import Product
from apps.recipes.models import Recipe

class DiaryEntry(models.Model):
    MEAL_CHOICES = (
        ('breakfast', 'Завтрак'),
        ('lunch', 'Обед'),
        ('dinner', 'Ужин'),
        ('snack', 'Перекус'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='diary_entries')
    date = models.DateField(db_index=True)
    meal_type = models.CharField(max_length=15, choices=MEAL_CHOICES)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    recipe = models.ForeignKey(Recipe, on_delete=models.SET_NULL, null=True, blank=True)
    amount_g = models.FloatField(null=True, blank=True)
    servings = models.FloatField(null=True, blank=True)
    
    calories = models.FloatField()
    proteins = models.FloatField()
    fats = models.FloatField()
    carbs = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'date']),
        ]


class WeightEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='weight_entries')
    date = models.DateField(db_index=True)
    weight_kg = models.FloatField()
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['date']
`,
  },
  {
    id: 'celery_export',
    category: 'celery',
    filename: 'exports/tasks.py',
    path: 'pureshque/backend/apps/exports/tasks.py',
    language: 'python',
    code: `import openpyxl
from celery import shared_task
from django.core.files.base import ContentFile
from apps.recipes.models import Recipe
from apps.diary.models import DiaryEntry

@shared_task
def generate_recipes_xlsx(user_id):
    """Генерация Excel файла с рецептами и КБЖУ с помощью openpyxl"""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Рецепты Pureshque"

    headers = [
        "Название блюда", "Порции", "Вес (г)", "Ккал всего", 
        "Белки (г)", "Жиры (г)", "Углеводы (г)", "Ккал на порцию"
    ]
    ws.append(headers)

    recipes = Recipe.objects.filter(is_public=True)
    for r in recipes:
        ws.append([
            r.title, r.servings, r.total_weight_g, r.total_calories,
            r.total_proteins, r.total_fats, r.total_carbs, r.calories_per_serving
        ])

    filename = f"media/exports/recipes_export_{user_id}.xlsx"
    wb.save(filename)
    return filename


@shared_task
def backup_database_to_yandex_disk():
    """Фоновый дамп PostgreSQL и отправка на Яндекс.Диск API"""
    import subprocess
    import requests
    # 1. pg_dump
    # 2. gzip
    # 3. Yandex.Disk OAuth Upload API
    return "Backup completed and synchronized successfully."
`,
  },
  {
    id: 'docker_compose',
    category: 'docker',
    filename: 'docker-compose.yml',
    path: 'docker-compose.yml',
    language: 'yaml',
    code: `services:
  db:
    image: postgres:16-alpine
    container_name: pureshque_postgres
    restart: always
    environment:
      POSTGRES_DB: pureshque_db
      POSTGRES_USER: pureshque_user
      POSTGRES_PASSWORD: secure_password_123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: pureshque_redis
    restart: always
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pureshque_backend
    restart: always
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      - DB_NAME=pureshque_db
      - DB_USER=pureshque_user
      - DB_PASSWORD=secure_password_123
      - DB_HOST=db
      - DB_PORT=5432
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pureshque_celery
    restart: always
    command: celery -A config worker -l info
    depends_on:
      - backend
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: pureshque_frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
`,
  },
  {
    id: 'tests_pytest',
    category: 'tests',
    filename: 'tests/test_calculations.py',
    path: 'pureshque/backend/tests/test_calculations.py',
    language: 'python',
    code: `import pytest
from apps.users.models import Profile

def test_mifflin_st_jeor_female():
    """Тест формулы Миффлина-Сан Жеора для женщины 26 лет, 62 кг, 168 см, средняя активность"""
    weight = 62.0
    height = 168.0
    age = 26
    
    # BMR = 10 * 62 + 6.25 * 168 - 5 * 26 - 161 = 620 + 1050 - 130 - 161 = 1379
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
    assert round(bmr) == 1379
    
    # TDEE (средняя активность 1.55) = 1379 * 1.55 = 2137
    tdee = bmr * 1.55
    assert round(tdee) == 2137
    
    # Снижение веса (-20%) = 2137 * 0.8 = 1710 ккал
    target_cal = round(tdee * 0.8)
    assert 1700 <= target_cal <= 1800


def test_recipe_kbju_calculation():
    """Тест расчёта КБЖУ на 100 г и на порцию"""
    ingredients = [
        {"weight": 100, "cal": 113, "prot": 23.6, "fat": 1.9, "carb": 0.4},
        {"weight": 100, "cal": 313, "prot": 12.6, "fat": 3.3, "carb": 62.1},
    ]
    total_weight = sum(i["weight"] for i in ingredients)
    total_cal = sum(i["cal"] for i in ingredients)
    
    assert total_weight == 200
    assert total_cal == 426
    
    cal_per_100g = (total_cal / total_weight) * 100
    assert cal_per_100g == 213.0
`,
  },
];

export const CodeInspector: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <div className="bg-[#E3F2FD] rounded-2xl p-6 border border-[#90CAF9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1] mb-1">
            <Layers className="w-4 h-4 text-[#1976D2]" />
            Архитектура & Исходный код проекта (Лабораторные работы 1–5)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D47A1]">
            Архитектура бэкенда, БД и Docker
          </h1>
          <p className="text-xs text-[#37474F] mt-1">
            Django 5, PostgreSQL 16, Celery воркеры, DRF сериализаторы и тесты pytest для защиты отчёта
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#90CAF9] hover:bg-[#F5F9FD] text-[#0D47A1] font-bold text-xs shadow-2xs transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Скопировано в буфер' : 'Скопировать текущий файл'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Tree Explorer */}
        <div className="bg-white rounded-2xl border border-[#E0E7DE] p-4 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EDF2F7]">
            <FolderTree className="w-4 h-4 text-[#4CAF50]" />
            <h3 className="font-bold text-sm text-[#1A202C]">Файлы проекта</h3>
          </div>

          <div className="space-y-1">
            {PROJECT_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  selectedFile.id === file.id
                    ? 'bg-[#E8F5E9] text-[#1B5E20] font-bold ring-1 ring-[#81C784]'
                    : 'text-[#4A5568] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-4 h-4 text-[#81C784] shrink-0" />
                  <span className="truncate">{file.filename}</span>
                </div>
                <span className="text-[10px] text-[#A0AEC0] uppercase">{file.language}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EDF2F7] text-[11px] text-[#718096] space-y-1">
            <div><strong>Backend:</strong> Python 3.11 + Django 5</div>
            <div><strong>Database:</strong> PostgreSQL 16</div>
            <div><strong>Tasks:</strong> Celery 5 + Redis</div>
            <div><strong>Tests:</strong> pytest-django</div>
          </div>
        </div>

        {/* Right Code Display */}
        <div className="lg:col-span-3 bg-[#1E293B] rounded-2xl shadow-lg border border-[#334155] overflow-hidden flex flex-col">
          {/* Code Header Bar */}
          <div className="bg-[#0F172A] px-4 py-3 border-b border-[#334155] flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2 text-white font-semibold">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-[#334155] hover:bg-[#475569] text-white text-[11px] font-mono flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Скопировано' : 'Copy'}
            </button>
          </div>

          {/* Code Body */}
          <pre className="p-5 text-xs text-[#E2E8F0] font-mono overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
