#!/usr/bin/env bash
set -euo pipefail

DB_WAIT_TIMEOUT=60

echo "🔧 Budowanie kontenerów..."
docker-compose build

echo "🔧 Uruchamianie kontenerów..."
docker-compose up -d

# Lista serwisów (dokładne nazwy z docker-compose.yml)
services=(event-app stadium-app comment-app payment-app auth-app)

echo
echo "🔧 Konfiguracja serwisów (kopiowanie .env, composer install, key generate)..."
for svc in "${services[@]}"; do
  echo "→ $svc"
  docker-compose exec -T "$svc" sh -c '
    if [ ! -f .env ]; then
      cp .env.example .env
      echo "  • .env utworzony"
    fi
    composer install
    echo "  • composer install OK"
    php artisan key:generate --force
    echo "  • klucz aplikacji wygenerowany"
  '
done

echo
echo "⏳ Oczekiwanie na bazy i migracje..."
for svc in "${services[@]}"; do
  # poprawne przypisanie nazwy bazy
  db="${svc%-app}-db"

  echo -n "⏳ Czekam na bazę $db..."
  for i in $(seq 1 "$DB_WAIT_TIMEOUT"); do
    if docker-compose exec -T "$db" sh -c "mysqladmin ping -h localhost -uuser -psecret > /dev/null 2>&1"; then
      echo " ✔️"
      break
    fi
    echo -n "."
    sleep 1
    if [ "$i" -eq "$DB_WAIT_TIMEOUT" ]; then
      echo
      echo "❌ Timeout oczekiwania na bazę $db."
      exit 1
    fi
  done

  echo "🚀 Migracje i seedy dla serwisu $svc..."
  docker-compose exec -T "$svc" sh -c "php artisan migrate --force && php artisan db:seed --force"
done

echo
echo "✅ Wszystkie mikroserwisy wystartowane i przygotowane."
