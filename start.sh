#!/bin/bash

set -e

echo "🚀 Uruchamiam kontenery w tle..."
docker-compose up -d --build

echo "⏳ Czekam na dostępność user-db..."
until docker exec user-db mysqladmin ping -uuser -puserpass --silent &> /dev/null; do
  echo "⛔ Brak połączenia z user-db"
  sleep 2
done

echo "⏳ Czekam na dostępność event-db..."
until docker exec event-db mysqladmin ping -uevent -peventpass --silent &> /dev/null; do
  echo "⛔ Brak połączenia z event-db"
  sleep 2
done

echo "⏳ Czekam na dostępność notification-db..."
until docker exec notification-db mysqladmin ping -unotification -pnotificationpass --silent &> /dev/null; do
  echo "⛔ Brak połączenia z notification-db"
  sleep 2
done

echo "⏳ Czekam na dostępność gateway-db..."
until docker exec gateway-db mysqladmin ping -ugateway -pgatewaypass --silent &> /dev/null; do
  echo "⛔ Brak połączenia z gateway-db"
  sleep 2
done

echo "✅ Bazy danych są gotowe."

echo "🚀 Uruchamiam notification-service osobno..."
docker-compose up -d notification-service

echo "✅ Notification-service gotowy."

echo "🏗 Wykonuję migracje..."
docker-compose exec user-service php artisan migrate --force
echo "✅ Migracje wykonane w user-service."

docker-compose exec event-service php artisan migrate --force
echo "✅ Migracje wykonane w event-service."

docker-compose exec gateway php artisan migrate --force
echo "✅ Migracje wykonane w gateway."

echo ""
echo "🎉 Gotowe! Aplikacja działa:"
echo "  ➤ http://localhost:8001 (user-service)"
echo "  ➤ http://localhost:8002 (event-service)"
echo "  ➤ http://localhost:8003 (notification-service)"
echo "  ➤ http://localhost:8080 (gateway)"
echo "  ➤ http://localhost:15672 (RabbitMQ UI)"
