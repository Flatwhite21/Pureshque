import React, { useState } from 'react';
import { BookOpen, Code2, Server, Database, Container, FileCheck, Copy, Check } from 'lucide-react';

export const ProjectDocsView: React.FC = () => {
  const [activeDocSection, setActiveDocSection] = useState<
    'overview' | 'startscript' | 'tree' | 'backend' | 'docker' | 'tests' | 'assumptions' | 'curl'
  >('startscript');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2EBDC] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] rounded">
              Учебный проект
            </span>
            <span className="text-xs text-[#718096]">Лабораторные работы 1, 3, 4, 5</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E3A1E] mt-1">
            Архитектура, код и спецификация проекта Pureshque
          </h1>
          <p className="text-xs sm:text-sm text-[#5D705D]">
            Полный стек: Django 5, DRF, PostgreSQL, Celery, Redis, React 18, Vite, Docker, pytest
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy('git clone https://github.com/pureshque/pureshque.git && docker-compose up --build')}
            className="px-3.5 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4 text-[#2E7D32]" />}
            <span>{copied ? 'Скопировано!' : 'Команда запуска Docker'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-[#F1F6EE] rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveDocSection('overview')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'overview' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Обзор & Стек
        </button>
        <button
          onClick={() => setActiveDocSection('startscript')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'startscript' ? 'bg-[#2E7D32] text-white shadow-2xs font-semibold' : 'text-[#5D705D]'
          }`}
        >
          🚀 Скрипты запуска (start.sh / start.bat)
        </button>
        <button
          onClick={() => setActiveDocSection('tree')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'tree' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Структура папок
        </button>
        <button
          onClick={() => setActiveDocSection('backend')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'backend' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Django Backend & Модели
        </button>
        <button
          onClick={() => setActiveDocSection('docker')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'docker' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Docker & Docker Compose
        </button>
        <button
          onClick={() => setActiveDocSection('tests')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'tests' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Тесты (pytest)
        </button>
        <button
          onClick={() => setActiveDocSection('curl')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'curl' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Примеры API (cURL)
        </button>
        <button
          onClick={() => setActiveDocSection('assumptions')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeDocSection === 'assumptions' ? 'bg-white text-[#1E3A1E] shadow-2xs' : 'text-[#5D705D]'
          }`}
        >
          Принятые допущения
        </button>
      </div>

      {/* SECTION: STARTSCRIPT */}
      {activeDocSection === 'startscript' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDF3E8] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1E3A1E] flex items-center gap-2">
                <span>🚀 Скрипты запуска приложения в 1 клик</span>
              </h2>
              <p className="text-xs text-[#718096] mt-0.5">
                Автоматически проверяет окружение, копирует .env, поднимает базу данных, запускает backend, применяет миграции и открывает веб-интерфейс
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/start.sh"
                download="start.sh"
                className="px-3.5 py-2 text-xs font-semibold text-white bg-[#4CAF50] hover:bg-[#43A047] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Скачать start.sh (Linux/Mac)
              </a>
              <a
                href="/start.bat"
                download="start.bat"
                className="px-3.5 py-2 text-xs font-semibold text-[#1E3A1E] bg-[#F1F8EC] border border-[#D8E6D0] hover:bg-[#E2F0DC] rounded-xl transition-colors cursor-pointer"
              >
                Скачать start.bat (Windows)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Linux/Mac instructions */}
            <div className="p-4 bg-[#FAFDF7] border border-[#DCE8D4] rounded-2xl space-y-3">
              <div className="font-bold text-sm text-[#1E3A1E] flex items-center justify-between">
                <span>Для Linux, macOS и WSL:</span>
                <span className="text-[11px] font-mono text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">start.sh</span>
              </div>
              <p className="text-xs text-[#718096]">
                Сделайте файл исполняемым и запустите его одной командой в терминале:
              </p>
              <pre className="p-3 bg-[#1A2E1A] text-[#A5D6A7] rounded-xl text-xs font-mono overflow-x-auto">
{`chmod +x start.sh
./start.sh`}
              </pre>
              <button
                onClick={() => handleCopy('chmod +x start.sh && ./start.sh')}
                className="text-xs font-semibold text-[#2E7D32] hover:underline cursor-pointer flex items-center gap-1"
              >
                Скопировать команду запуска
              </button>
            </div>

            {/* Windows instructions */}
            <div className="p-4 bg-[#FAFDF7] border border-[#DCE8D4] rounded-2xl space-y-3">
              <div className="font-bold text-sm text-[#1E3A1E] flex items-center justify-between">
                <span>Для Windows:</span>
                <span className="text-[11px] font-mono text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded">start.bat</span>
              </div>
              <p className="text-xs text-[#718096]">
                Дважды кликните по файлу <strong>start.bat</strong> или выполните в командной строке (CMD / PowerShell):
              </p>
              <pre className="p-3 bg-[#1A2E1A] text-[#A5D6A7] rounded-xl text-xs font-mono overflow-x-auto">
{`start.bat`}
              </pre>
              <p className="text-[11px] text-[#718096]">
                Скрипт автоматически запустит Docker Compose, проведёт миграции и откроет http://localhost:3000 в вашем браузере.
              </p>
            </div>
          </div>

          <div className="p-4 bg-[#F1F8EC] border border-[#D5E8CC] rounded-2xl text-xs text-[#2E7D32] space-y-1">
            <div className="font-bold">Что делает скрипт автоматически:</div>
            <ul className="list-disc list-inside space-y-0.5 text-[#4A5D4A]">
              <li>Проверяет наличие файла <code>.env</code> (если нет — автоматически копирует из <code>.env.example</code>)</li>
              <li>Проверяет установку Docker / docker-compose</li>
              <li>Собирает и запускает все 5 контейнеров: PostgreSQL, Redis, Django API, Celery Worker, React Frontend</li>
              <li>Ожидает готовности базы данных и запускает <code>python manage.py migrate</code></li>
              <li>Загружает фикстуры начальных данных пользователей и продуктов <code>initial_data.json</code></li>
              <li>Автоматически открывает в браузере <code>http://localhost:3000</code></li>
            </ul>
          </div>
        </div>
      )}

      {/* SECTION: OVERVIEW */}
      {activeDocSection === 'overview' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-6 text-sm text-[#2D3748]">
          <div>
            <h2 className="text-lg font-bold text-[#1E3A1E] mb-2">1. Назначение и концепция Pureshque</h2>
            <p className="leading-relaxed">
              <strong>Pureshque</strong> — современная кроссплатформенная веб-система для расчёта КБЖУ продуктов и сложных кулинарных рецептов, ведения индивидуального дневника питания, мониторинга веса и глубокой аналитики рациона. Система освобождает пользователя от необходимости производить ручные расчеты и помогает достигать персональных целей: снижение массы тела, поддержание баланса или набор массы.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <h3 className="font-bold text-sm text-[#1E3A1E] mb-2 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-[#2E7D32]" />
                <span>Backend архитектура</span>
              </h3>
              <ul className="space-y-1 text-xs text-[#4A5568] list-disc list-inside">
                <li><strong>Python 3.11+ / Django 5.1 & Django REST Framework</strong></li>
                <li><strong>База данных:</strong> PostgreSQL 16 с индексами по датам и пользователям</li>
                <li><strong>Фоновые очереди:</strong> Celery 5.4 + Redis 7 для генерации PDF/XLSX и бэкапов</li>
                <li><strong>Аутентификация:</strong> JWT (SimpleJWT) + Сессии + OAuth2 (VK ID, Yandex ID)</li>
                <li><strong>Экспорт:</strong> WeasyPrint/ReportLab для PDF, openpyxl/xlsx для Excel</li>
                <li><strong>Резервное копирование:</strong> Автоматический экспорт дампов в Яндекс.Диск API</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <h3 className="font-bold text-sm text-[#1E3A1E] mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#2E7D32]" />
                <span>Frontend архитектура</span>
              </h3>
              <ul className="space-y-1 text-xs text-[#4A5568] list-disc list-inside">
                <li><strong>React 19 / TypeScript / Vite</strong></li>
                <li><strong>Стилизация:</strong> Tailwind CSS v4, адаптивный мобильный дизайн</li>
                <li><strong>Цветовая гамма:</strong> Фирменные нежно-зелёные и тёплые бежевые тона (#E8F5E9, #FAF0E6, #4CAF50)</li>
                <li><strong>Интерактивный дашборд:</strong> 100% соответствие прототипу Лабораторной работы 5</li>
                <li><strong>Конструктор рецептов:</strong> Мгновенный пересчет КБЖУ на 100 г и на порцию</li>
                <li><strong>Аналитика:</strong> Динамические диаграммы, соотношение БЖУ, тренды веса</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: TREE */}
      {activeDocSection === 'tree' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Иерархическая структура репозитория</h2>
          <pre className="p-4 bg-[#1A2E1A] text-[#A5D6A7] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`pureshque/
├── backend/                        # Django 5 Backend
│   ├── config/                     # Главные настройки Django
│   │   ├── __init__.py
│   │   ├── settings.py             # Настройки БД, JWT, Celery, CORS
│   │   ├── urls.py                 # Главный роутинг REST API
│   │   ├── wsgi.py
│   │   └── celery.py               # Конфигурация воркеров Celery
│   ├── apps/
│   │   ├── users/                  # Модель User, Profile, Auth, OAuth (VK/Яндекс)
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── products/               # Модели Product, Ingredient, поиск, фильтры
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── recipes/                # Модели Recipe, RecipeIngredient, формулы КБЖУ
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── diary/                  # Модель DiaryEntry (Завтрак, Обед, Ужин, Снек)
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── analytics/              # Эндпоинты статистики, БЖУ, рекомендации
│   │   │   ├── services.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── exports/                # Генерация PDF (WeasyPrint) и XLSX (openpyxl)
│   │   │   ├── tasks.py            # Celery асинхронные задачи
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   ├── admin_panel/            # Кастомное API администратора, блокировки
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   └── integrations/           # Адаптеры Яндекс.Диск, Open Food Facts, SMTP
│   │       ├── yandex_disk.py
│   │       ├── openfoodfacts.py
│   │       └── oauth.py
│   ├── tests/                      # Набор тестов pytest
│   │   ├── test_calculations.py    # Тесты формулы Миффлина-Сан Жеора, БЖУ
│   │   ├── test_recipes.py         # Тесты расчёта КБЖУ на 100г и порцию
│   │   └── test_api.py             # Интеграционные тесты эндпоинтов
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                       # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/             # Dashboard, Diary, Recipes, Analytics, Admin
│   │   ├── context/                # AppContext (глобальное состояние)
│   │   ├── utils/                  # calculator.ts, export.ts
│   │   ├── types/                  # TypeScript модели данных
│   │   ├── data/                   # Фикстуры начальных данных
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── fixtures/                       # Начальные данные продуктов и пользователей
│   └── initial_data.json
├── docker-compose.yml              # Оркестрация: backend, db, redis, celery, frontend
├── .env.example                    # Шаблон конфигурационных переменных
└── README.md                       # Полная инструкция по развёртыванию и API`}
          </pre>
        </div>
      )}

      {/* SECTION: BACKEND */}
      {activeDocSection === 'backend' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Ключевые модели данных Django (PostgreSQL)</h2>
          <pre className="p-4 bg-[#1A2E1A] text-[#E8F5E9] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`# backend/apps/users/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен для регистрации')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (('user', 'Пользователь'), ('admin', 'Администратор'))
    PROVIDER_CHOICES = (('email', 'Email'), ('vk', 'ВКонтакте'), ('yandex', 'Яндекс'))

    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='email')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'

class Profile(models.Model):
    GENDER_CHOICES = (('male', 'Мужской'), ('female', 'Женский'))
    ACTIVITY_CHOICES = (
        ('min', '1.2 - Минимальная'),
        ('low', '1.375 - Низкая'),
        ('medium', '1.55 - Средняя'),
        ('high', '1.725 - Высокая'),
        ('very_high', '1.9 - Очень высокая'),
    )
    GOAL_CHOICES = (('lose', 'Снижение веса'), ('maintain', 'Поддержание'), ('gain', 'Набор массы'))

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
    updated_at = models.DateTimeField(auto_now=True)`}
          </pre>
        </div>
      )}

      {/* SECTION: DOCKER */}
      {activeDocSection === 'docker' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Конфигурация docker-compose.yml</h2>
          <pre className="p-4 bg-[#1A2E1A] text-[#A5D6A7] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: pureshque_postgres
    restart: always
    environment:
      POSTGRES_DB: pureshque_db
      POSTGRES_USER: pureshque_user
      POSTGRES_PASSWORD: pureshque_password
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
    command: >
      sh -c "python manage.py migrate &&
             python manage.py loaddata fixtures/initial_data.json &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./backend:/app
      - static_volume:/app/static
      - media_volume:/app/media
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  celery_worker:
    build:
      context: ./backend
    container_name: pureshque_celery_worker
    restart: always
    command: celery -A config worker --loglevel=info
    volumes:
      - ./backend:/app
      - media_volume:/app/media
    env_file:
      - .env
    depends_on:
      - redis
      - db

  celery_beat:
    build:
      context: ./backend
    container_name: pureshque_celery_beat
    restart: always
    command: celery -A config beat --loglevel=info
    volumes:
      - ./backend:/app
    env_file:
      - .env
    depends_on:
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
  static_volume:
  media_volume:`}
          </pre>
        </div>
      )}

      {/* SECTION: TESTS */}
      {activeDocSection === 'tests' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Тесты pytest для расчёта формул и API</h2>
          <pre className="p-4 bg-[#1A2E1A] text-[#E8F5E9] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`# backend/tests/test_calculations.py
import pytest

def calculate_bmr(gender: str, weight_kg: float, height_cm: float, age: int) -> float:
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    return base + 5 if gender == 'male' else base - 161

def calculate_target_calories(bmr: float, activity_multiplier: float, goal: str) -> int:
    tdee = bmr * activity_multiplier
    if goal == 'lose':
        return round(tdee * 0.8)  # -20%
    elif goal == 'gain':
        return round(tdee * 1.15) # +15%
    return round(tdee)

def test_mifflin_st_jeor_female():
    # Александра: Женщина, 26 лет, 168 см, 62 кг
    bmr = calculate_bmr(gender='female', weight_kg=62, height_cm=168, age=26)
    # BMR = 10*62 + 6.25*168 - 5*26 - 161 = 620 + 1050 - 130 - 161 = 1379 ккал
    assert round(bmr) == 1379

    # Средняя активность (1.55), цель - снижение веса (-20%)
    target = calculate_target_calories(bmr=bmr, activity_multiplier=1.55, goal='lose')
    # TDEE = 1379 * 1.55 = 2137.45. Target = 2137.45 * 0.8 = 1710 ккал
    assert target == 1710

def test_recipe_kbju_calculation():
    # Проверка формулы расчёта блюда на 100г и на порцию
    ingredients = [
        {"name": "Куриное филе", "grams": 200, "calories": 290, "proteins": 62.0, "fats": 5.0, "carbs": 0.0},
        {"name": "Гречневая крупа", "grams": 150, "calories": 165, "proteins": 6.3, "fats": 1.7, "carbs": 32.0},
    ]
    total_weight = sum(i["grams"] for i in ingredients) # 350g
    total_cals = sum(i["calories"] for i in ingredients) # 455 kcal
    servings = 2

    cals_per_100g = round((total_cals / total_weight) * 100) # 130 kcal
    cals_per_serving = round(total_cals / servings)           # 228 kcal

    assert total_weight == 350
    assert total_cals == 455
    assert cals_per_100g == 130
    assert cals_per_serving == 228`}
          </pre>
        </div>
      )}

      {/* SECTION: CURL */}
      {activeDocSection === 'curl' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#1E3A1E]">Примеры запросов к REST API (cURL)</h2>
          <pre className="p-4 bg-[#1A2E1A] text-[#A5D6A7] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`# 1. Регистрация нового пользователя
curl -X POST http://localhost:8000/api/auth/register/ \\
  -H "Content-Type: application/json" \\
  -d '{"email": "alexandra@pureshque.ru", "password": "secure_password123", "first_name": "Александра", "last_name": "Смирнова"}'

# 2. Получение JWT токена (Вход)
curl -X POST http://localhost:8000/api/auth/login/ \\
  -H "Content-Type: application/json" \\
  -d '{"email": "alexandra@pureshque.ru", "password": "secure_password123"}'

# 3. Расчёт и получение дневной нормы по Миффлину-Сан Жеору
curl -X GET http://localhost:8000/api/profile/norm/ \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"

# 4. Добавление записи в Дневник питания (Завтрак)
curl -X POST http://localhost:8000/api/diary/ \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"date": "2026-10-13", "meal_type": "breakfast", "product_id": "prod_1", "amount_g": 250}'

# 5. Экспорт дневника в PDF (Celery задача)
curl -X POST http://localhost:8000/api/export/diary/pdf/ \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"period_start": "2026-10-01", "period_end": "2026-10-13"}'

# 6. Создание резервной копии БД администратором
curl -X POST http://localhost:8000/api/admin/backups/ \\
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"`}
          </pre>
        </div>
      )}

      {/* SECTION: ASSUMPTIONS */}
      {activeDocSection === 'assumptions' && (
        <div className="bg-white border border-[#E2EBDC] rounded-2xl p-6 shadow-xs space-y-4 text-sm text-[#2D3748]">
          <h2 className="text-base font-bold text-[#1E3A1E]">Принятые архитектурные допущения</h2>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <span className="font-semibold text-xs text-[#1E3A1E]">1. Формула метаболизма:</span>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Используется современная формула Миффлина-Сан Жеора как наиболее валидированная в клинической диетологии. Для дефицита применяется коэффициент 0.8 (-20%), для набора массы — 1.15 (+15%).
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <span className="font-semibold text-xs text-[#1E3A1E]">2. Квота макронутриентов:</span>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Белки фиксируются в диапазоне 1.6–2.2 г/кг (по умолчанию 1.8 г/кг), жиры — 0.8–1.1 г/кг (по умолчанию 0.9 г/кг). Углеводы рассчитываются по калорийному остатку: (Калории - Белки×4 - Жиры×9) / 4.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <span className="font-semibold text-xs text-[#1E3A1E]">3. Политика удаления данных (Privacy / GDPR):</span>
              <p className="text-xs text-[#4A5568] mt-0.5">
                При удалении аккаунта персональные данные пользователя и личные дневники полностью удаляются или обезличиваются. Если пользователь просто не заходит в систему, его данные надежно сохраняются.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#DCE8D4] bg-[#FAFDF7]">
              <span className="font-semibold text-xs text-[#1E3A1E]">4. Внешние базы продуктов и Яндекс.Диск:</span>
              <p className="text-xs text-[#4A5568] mt-0.5">
                Реализованы адаптеры для Open Food Facts / USDA и Яндекс.Диск API с возможностью мягкого fallback в случае отсутствия внешнего интернет-соединения или истечения квоты API.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
