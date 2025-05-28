#!/usr/bin/env bash
set -euo pipefail

# Usuwanie kontenerów, wolumenów i obrazów dla sports-club
echo "🧹 Sprzątanie Docker..."
docker-compose down -v --remove-orphans

echo "🔨 Czyszczę frontend/dist... i frontend/node_module"
rm -rf "frontend/dist/*"
rm -rf "frontend/node_module"

echo "🔨 Czyszczę vendor/ i .env w usługach..."
# Lista katalogów z usługami\services=(user event stadium comment payment auth)
services=(event stadium comment payment auth)
for svc in "${services[@]}"; do
  dir="services/${svc}"
  if [ -d "$dir/vendor" ]; then
    rm -rf "$dir/vendor"
    echo "  • Usunięto $dir/vendor"
  fi
  if [ -f "$dir/.env" ]; then
    rm -f "$dir/.env"
    echo "  • Usunięto $dir/.env"
  fi
done

echo "✅ Sprzątanie zakończone."
