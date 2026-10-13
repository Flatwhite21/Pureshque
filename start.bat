@echo off
title Pureshque — Запуск проекта

echo ======================================================
echo    Pureshque — Запуск полного веб-приложения
echo ======================================================

:: 1. Проверка файла .env
if not exist ".env" (
    echo [!] Создаем .env из .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo [OK] Файл .env создан.
    ) else (
        echo [ERROR] Файл .env.example не найден.
        pause
        exit /b 1
    )
) else (
    echo [OK] Файл .env уже существует.
)

:: 2. Проверка Docker
echo [i] Проверка Docker в системе...
docker --version
if errorlevel 1 (
    echo.
    echo [!] Docker не найден в PATH.
    echo Попытка локального запуска Frontend через Node.js...
    npm --version
    if errorlevel 1 (
        echo [ERROR] Ни Docker, ни Node.js не установлены.
        echo Пожалуйста, установите Docker Desktop: https://www.docker.com/products/docker-desktop/
        pause
        exit /b 1
    )
    call npm install
    start http://localhost:3000
    call npm run dev
    exit /b 0
)

:: 3. Запуск контейнеров через Docker Compose
echo.
echo [i] Сборка и запуск контейнеров: PostgreSQL, Redis, Django, Celery, React...
docker compose up --build -d
if errorlevel 1 (
    echo [i] Пробуем команду docker-compose...
    docker-compose up --build -d
)

echo.
echo [...] Ожидание инициализации базы данных (5 сек)...
timeout /t 5 /nobreak

echo [...] Применение миграций Django...
docker compose exec backend python manage.py migrate --noinput
if errorlevel 1 (
    docker-compose exec backend python manage.py migrate --noinput
)

echo [...] Загрузка начальных данных...
docker compose exec backend python manage.py loaddata ../fixtures/initial_data.json
if errorlevel 1 (
    docker-compose exec backend python manage.py loaddata ../fixtures/initial_data.json
)

echo.
echo ======================================================
echo    Все сервисы Pureshque успешно запущены!
echo ======================================================
echo    Веб-интерфейс:   http://localhost:3000
echo    Backend API:     http://localhost:8000/api/
echo    Админ-панель:    http://localhost:8000/admin/
echo ======================================================
echo.
echo Открываем браузер...
start http://localhost:3000

echo Для остановки проекта выполните: docker compose down
echo.
pause
