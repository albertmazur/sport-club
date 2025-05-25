# 🏟️ Sports Club Microservices App

Aplikacja do zarządzania klubem sportowym zbudowana w architekturze mikrousług, oparta o **Laravel**, **Octane (Swoole)** i **Docker Compose**.

---

## 🧩 Mikrousługi

| Serwis               | Port        | Opis                                      |
|----------------------|-------------|-------------------------------------------|
| `user-service`       | `8001`      | Rejestracja, logowanie, zarządzanie kontem użytkownika |
| `event-service`      | `8002`      | Zarządzanie wydarzeniami, treningami      |
| `notification-service` | `8003`    | Obsługa powiadomień (RabbitMQ)            |
| `api-gateway`        | `8080`      | Bramka dla żądań REST API (Octane + Swoole) |
| `user-db`            | `33061`     | Baza danych MySQL dla użytkowników        |
| `event-db`           | `33062`     | Baza danych MySQL dla wydarzeń            |
| `notification-db`    | `33063`     | Baza danych MySQL dla powiadomień         |
| `gateway-db`         | `33064`     | Baza danych MySQL dla gatewaya            |
| `rabbitmq`           | `5672 / 15672` | Broker wiadomości + UI pod `15672`     |

---

## 🧱 Struktura katalogów

```text
sports-club/
├── api-gateway/
│   ├── Dockerfile
│   ├── .env
│   └── ... (Laravel + Octane)
├── user-service/
│   ├── Dockerfile
│   ├── .env
│   └── ... (Laravel)
├── event-service/
│   ├── Dockerfile
│   ├── .env
│   └── ... (Laravel)
├── notification-service/
│   ├── Dockerfile
│   ├── .env
│   └── ... (Laravel + RabbitMQ listener)
├── docker-compose.yml
├── start.sh
└── README.md
```

---

## 🚀 Jak uruchomić projekt?

> Upewnij się, że masz zainstalowane: `Docker`, `Docker Compose` i `bash`.

1. 🔧 Nadaj uprawnienia do uruchamiania:
   ```bash
   chmod +x start.sh
   ```

2. 🏃 Uruchom aplikację:
   ```bash
   ./start.sh
   ```

3. 📬 Odwiedź usługi w przeglądarce:

| Usługa                  | Adres URL                              |
|--------------------------|-----------------------------------------|
| Gateway (API)            | http://localhost:8080                   |
| User Service             | http://localhost:8001                   |
| Event Service            | http://localhost:8002                   |
| Notification Service     | http://localhost:8003                   |
| RabbitMQ (UI)            | http://localhost:15672 (login: guest)   |

---

## 📦 Dodatkowe informacje

- Do komunikacji między usługami można wykorzystać HTTP (via API Gateway) oraz RabbitMQ.
- `api-gateway` działa na Laravel Octane z Swoole (duża wydajność).
- Wszystkie migracje są uruchamiane automatycznie z poziomu `start.sh`.