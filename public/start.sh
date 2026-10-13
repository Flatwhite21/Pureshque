#!/usr/bin/env bash
# ==============================================================================
# Pureshque (Пюрешка) — Единый скрипт автоматического запуска всего проекта
# Поддерживает: Linux, macOS, WSL (Windows Subsystem for Linux)
# ==============================================================================

set -e

GREEN='\033[032m'
BLUE='\033[034m'
YELLOW='\033[1;33m'
RED='\033[031m'
NC='\033[0m' # No Color

echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}   🥗 Pureshque — Запуск полного веб-приложения       ${NC}"
echo -e "${GREEN}======================================================${NC}"

# 1. Проверка наличия .env файла, создание из .env.example при необходимости
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[!] Файл .env не найден. Создаём конфигурацию из .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}[✓] Файл .env успешно создан.${NC}"
    else
        echo -e "${RED}[✗] Ошибка: .env.example не найден.${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}[i] Файл конфигурации .env уже существует.${NC}"
fi

# 2. Проверка Docker и Docker Compose
if command -v docker &> /dev/null && (docker compose version &> /dev/null || command -v docker-compose &> /dev/null); then
    echo -e "${BLUE}[i] Docker и Docker Compose обнаружены в системе.${NC}"
    echo -e "${YELLOW}[...] Сборка и запуск всех сервисов (PostgreSQL, Redis, Django, Celery, React)...${NC}"

    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    # Остановка старых контейнеров если были запущены
    $COMPOSE_CMD down --remove-orphans || true

    # Сборка и запуск в фоновом режиме
    $COMPOSE_CMD up --build -d

    echo -e "${YELLOW}[...] Ожидание инициализации базы данных PostgreSQL и запуска backend...${NC}"
    sleep 5

    # Применение миграций и загрузка фикстур
    echo -e "${YELLOW}[...] Применение миграций Django и загрузка начальных данных...${NC}"
    $COMPOSE_CMD exec backend python manage.py migrate --noinput || true
    $COMPOSE_CMD exec backend python manage.py loaddata ../fixtures/initial_data.json || true

    echo -e "\n${GREEN}======================================================${NC}"
    echo -e "${GREEN}   🎉 Все сервисы Pureshque успешно запущены!        ${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo -e "   🌐 Веб-интерфейс (Frontend):  ${BLUE}http://localhost:3000${NC}"
    echo -e "   🔌 REST API (Backend):        ${BLUE}http://localhost:8000/api/${NC}"
    echo -e "   🛡️ Админ-панель Django:       ${BLUE}http://localhost:8000/admin/${NC}"
    echo -e "   📊 Документация API:          ${BLUE}http://localhost:8000/api/docs/${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo -e "Для остановки всех контейнеров выполните: ${YELLOW}$COMPOSE_CMD down${NC}\n"

    # Открытие браузера если доступно
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000 &> /dev/null || true
    elif command -v open &> /dev/null; then
        open http://localhost:3000 &> /dev/null || true
    fi

    exit 0
fi

# 3. Fallback: Локальный запуск без Docker (если Docker не установлен)
echo -e "${YELLOW}[!] Docker не найден. Попытка локального запуска через Node.js и Python...${NC}"

if command -v npm &> /dev/null; then
    echo -e "${GREEN}[...] Установка зависимостей и запуск Frontend...${NC}"
    npm install
    echo -e "${GREEN}[✓] Запуск веб-сервера на http://localhost:3000...${NC}"
    npm run dev
else
    echo -e "${RED}[✗] Для запуска необходим либо Docker с docker-compose, либо Node.js с npm.${NC}"
    echo -e "${YELLOW}Пожалуйста, установите Docker Desktop: https://www.docker.com/products/docker-desktop/${NC}"
    exit 1
fi
