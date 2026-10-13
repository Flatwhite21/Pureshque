# Pureshque (Пюрешка) — Сервис расчёта КБЖУ, ведения дневника питания и анализа рациона

Веб-платформа для автоматизированного контроля питания, расчета калорийности и БЖУ блюд и ингредиентов, мониторинга массы тела и формирования отчетов для диетологов.

---

## 1. Стек технологий

* **Backend**: Python 3.11, Django 5.1, Django REST Framework, SimpleJWT
* **База данных**: PostgreSQL 16 (с индексами по пользователям и датам)
* **Асинхронные задачи & очереди**: Celery 5.4, Redis 7
* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, xlsx
* **Отчеты**: WeasyPrint / ReportLab (PDF), openpyxl / xlsx (Excel)
* **Внешние интеграции**: Яндекс.Диск API (бекапы), Open Food Facts & USDA (база продуктов), OAuth 2.0 (VK ID, Яндекс ID), SMTP (Email)
* **Контейнеризация**: Docker, Docker Compose
* **Тестирование**: pytest, pytest-django

---

## 2. Структура проекта

```text
pureshque/
├── backend/                        # Django REST Backend
│   ├── config/                     # Настройки Django, Celery, WSGI
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/                  # Пользователи, профиль, JWT, OAuth
│   │   ├── products/               # Каталог продуктов, поиск, фильтры
│   │   ├── recipes/                # Рецепты, калькулятор КБЖУ порций
│   │   ├── diary/                  # Дневник питания, замеры веса
│   │   ├── analytics/              # Аналитика калорий, макросов, рекомендации
│   │   ├── exports/                # Celery задачи формирования PDF и XLSX
│   │   ├── admin_panel/            # Кастомное администрирование и бэкапы
│   │   └── integrations/           # Яндекс.Диск, Open Food Facts
│   ├── tests/                      # pytest тесты формул и API
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                       # React 19 SPA
│   ├── src/
│   │   ├── components/             # Dashboard, Diary, Recipes, Analytics, Admin
│   │   ├── context/                # AppContext (управление состоянием)
│   │   ├── utils/                  # calculator.ts (Миффлин-Сан Жеор, БЖУ)
│   │   ├── types/                  # TypeScript интерфейсы
│   │   ├── data/                   # Фикстуры начальных данных
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── fixtures/                       # Начальные данные PostgreSQL
│   └── initial_data.json
├── docker-compose.yml              # Оркестрация сервисов
├── .env.example                    # Переменные окружения
└── README.md                       # Документация проекта
```

---

## 3. Принятые допущения (Assumptions)

1. **Формула расчета суточного расхода (TDEE)**:
   Применяется клинически валидированная формула **Миффлина-Сан Жеора**:
   * Мужчины: $BMR = 10 \times \text{вес (кг)} + 6.25 \times \text{рост (см)} - 5 \times \text{возраст} + 5$
   * Женщины: $BMR = 10 \times \text{вес (кг)} + 6.25 \times \text{рост (см)} - 5 \times \text{возраст} - 161$
   * $TDEE = BMR \times \text{коэффициент активности}$ (1.2 / 1.375 / 1.55 / 1.725 / 1.9)
   * Коррекция: Снижение веса — минус 20% калорий, Набор массы — плюс 15%, Поддержание — без изменений.

2. **Распределение БЖУ**:
   * Белки: 1.8 г на 1 кг массы тела ($4 \text{ ккал/г}$)
   * Жиры: 0.9 г на 1 кг массы тела ($9 \text{ ккал/г}$)
   * Углеводы: рассчитываются по остаточному калоражу: $\frac{\text{Калории} - (\text{Белки} \times 4 + \text{Жиры} \times 9)}{4}$

3. **Расчет КБЖУ рецептов и порций**:
   * Для каждого ингредиента значение КБЖУ пересчитывается строго пропорционально весу в граммах.
   * Суммируются граммы всех ингредиентов (общий вес блюда).
   * КБЖУ на 100 г рассчитывается как отношение общего КБЖУ к общему весу блюда $\times 100$.
   * КБЖУ на порцию пересчитывается динамически при изменении количества порций пользователем.

4. **Политика конфиденциальности и удаления данных**:
   * При удалении аккаунта все персональные записи дневника и замеры веса удаляются или обезличиваются.
   * Если пользователь не заходит в систему, его данные не удаляются.

5. **Отказоустойчивость внешних интеграций**:
   * При отсутствии подключения к интернету или недоступности API Яндекс.Диска и Open Food Facts система продолжает штатную работу с локальной базой данных и локальным хранилищем дампов.

---

## 4. Инструкция по запуску

### Быстрый запуск через Docker Compose (рекомендуется)

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/pureshque/pureshque.git
   cd pureshque
   ```

2. Скопируйте шаблон переменных окружения:
   ```bash
   cp .env.example .env
   ```

3. Запустите контейнеры:
   ```bash
   docker-compose up --build
   ```

Сервисы будут доступны по адресам:
* Frontend (веб-интерфейс): [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)
* Django Admin: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## 5. Тестирование

Запуск тестов pytest внутри backend-контейнера:

```bash
docker-compose exec backend pytest
```

Тестовое покрытие включает:
* Unit-тесты формулы Миффлина-Сан Жеора для мужчин и женщин
* Unit-тесты расчета БЖУ и макронутриентов
* Unit-тесты калькулятора рецептов (на 100 г и на порцию)
* Интеграционные тесты прав доступа DRF и генерации отчетов

---

## 6. Примеры запросов к REST API

### 1. Регистрация нового пользователя
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alexandra@pureshque.ru",
    "password": "StrongPassword123!",
    "first_name": "Александра",
    "last_name": "Смирнова"
  }'
```

### 2. Авторизация и получение JWT-токена
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alexandra@pureshque.ru",
    "password": "StrongPassword123!"
  }'
```

### 3. Получение дневной нормы калорий и БЖУ
```bash
curl -X GET http://localhost:8000/api/profile/norm/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 4. Добавление продукта в дневник питания
```bash
curl -X POST http://localhost:8000/api/diary/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-10-13",
    "meal_type": "breakfast",
    "product": 1,
    "amount_g": 250
  }'
```

### 5. Создание рецепта с автоматическим пересчетом
```bash
curl -X POST http://localhost:8000/api/recipes/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Боул с курицей и киноа",
    "servings": 2,
    "is_public": true,
    "ingredients": [
      {"product_id": 3, "amount_g": 200},
      {"product_id": 2, "amount_g": 150}
    ]
  }'
```

### 6. Запуск фоновой задачи экспорта рецептов в XLSX (Celery)
```bash
curl -X POST http://localhost:8000/api/export/recipes/xlsx/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 7. Создание резервной копии базы данных (Администратор)
```bash
curl -X POST http://localhost:8000/api/admin/backups/ \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```
