# ======================================================
# Pureshque — PowerShell Скрипт быстрого запуска
# ======================================================

Write-Host "======================================================" -ForegroundColor Green
Write-Host "   🥗 Pureshque — Запуск полного веб-приложения       " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

# 1. Проверка .env
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[✓] Файл .env создан из .env.example" -ForegroundColor Green
    } else {
        Write-Host "[✗] Ошибка: .env.example не найден" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[i] Файл .env уже существует" -ForegroundColor Cyan
}

# 2. Проверка Docker
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue

if ($dockerInstalled) {
    Write-Host "[i] Docker найден. Сборка и запуск контейнеров..." -ForegroundColor Cyan

    $composeCmd = "docker compose"
    docker compose version 2>$null
    if ($LASTEXITCODE -ne 0) {
        $composeCmd = "docker-compose"
    }

    Invoke-Expression "$composeCmd up --build -d"

    Write-Host "[...] Ожидание запуска БД PostgreSQL (5 сек)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5

    Write-Host "[...] Применение миграций..." -ForegroundColor Yellow
    Invoke-Expression "$composeCmd exec backend python manage.py migrate --noinput"

    Write-Host "[...] Загрузка начальных данных..." -ForegroundColor Yellow
    Invoke-Expression "$composeCmd exec backend python manage.py loaddata ../fixtures/initial_data.json"

    Write-Host "`n======================================================" -ForegroundColor Green
    Write-Host "   🎉 Все сервисы Pureshque успешно запущены!" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host "   🌐 Веб-интерфейс:   http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   🔌 Backend API:     http://localhost:8000/api/" -ForegroundColor Cyan
    Write-Host "   🛡️ Админ-панель:    http://localhost:8000/admin/" -ForegroundColor Cyan
    Write-Host "======================================================`n" -ForegroundColor Green

    Start-Process "http://localhost:3000"
} else {
    Write-Host "[!] Docker не найден. Запуск локального режима через npm..." -ForegroundColor Yellow
    if (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
        Start-Process "http://localhost:3000"
        npm run dev
    } else {
        Write-Host "[✗] Установите Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    }
}
