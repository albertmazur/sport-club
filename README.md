# 🏟️ Sports Club Microservices App

Aplikacja webowa do zarządzania klubem sportowym zbudowana w architekturze mikrousług, oparta o **Laravel (Lumen)**, **PHP-FPM**, **Nginx** i **Docker Compose**.

---

## 🧩 Mikrousługi

| Serwis           | Port    | Opis                                               |   |
| ---------------- | ------- | -------------------------------------------------- | - |
| **user**         | `8001`  | Rejestracja, logowanie i zarządzanie użytkownikiem |   |
| **event**        | `8002`  | Tworzenie i zarządzanie wydarzeniami i treningami  |   |
| **comment**      | `8003`  | Zarządzanie komentarzami do wydarzeń               |   |
| **payment**      | `8004`  | Obsługa płatności (Stripe)                         |   |
| **auth-service** | `8080`  | Bramkowanie, autoryzacja i proxy REST API          |   |
| **user-db**      | `33061` | MySQL dla `user-service`                           |   |
| **event-db**     | `33062` | MySQL dla `event-service`                          |   |
| **comment-db**   | `33063` | MySQL dla `comment-service`                        |   |
| **payment-db**   | `33064` | MySQL dla `payment-service`                        |   |

---

## 📁 Struktura katalogów

```text
sports-club/
├── docker-compose.yml          # Orkiestracja wszystkich usług
├── docker/
│   └── nginx/
│       └── conf.d/
│           └── default.conf    # Konfiguracja Nginx dla API Gateway
├── php/
│   └── local.ini               # Globalne ustawienia PHP dla wszystkich serwisów
├── services/                   # Mikroserwisy zwracające JSON
│   ├── auth/                   # Rejestracja i logowanie (Lumen)
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── php/
│   │       └── local.ini
│   ├── event/                  # Zarządzanie wydarzeniami (Lumen)
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── php/
│   │       └── local.ini
│   ├── stadium/                # CRUD stadionów (Lumen)
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── php/
│   │       └── local.ini
│   ├── comment/                # Komentarze do wydarzeń (Lumen)
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── php/
│   │       └── local.ini
│   └── payment/                # Obsługa płatności (Lumen)
│       ├── Dockerfile
│       ├── .env.example
│       └── php/
│           └── local.ini
├── start.sh                    # Skrypt uruchomieniowy (migracje, seedy)
├── README.md                   # Dokumentacja projektu
└── LICENSE                     # Licencja MIT
```

---

## 🚀 Uruchomienie

### 1. Wymagania

* Docker
* Docker Compose
* Bash (Linux/macOS) lub Git Bash (Windows)

### 2. Konfiguracja środowiska

Dla każdego serwisu utwórz plik `.env` na podstawie `.env.example` i ustaw dane połączeń:

```bash
for svc in user event comment payment auth; do
  cp services/$svc/.env.example services/$svc/.env
done
```

**Przykładowe zmienne w `.env` usług backendowych:**

```dotenv
DB_CONNECTION=mysql
DB_HOST=${svc}-db
DB_PORT=3306
DB_DATABASE=${svc}
DB_USERNAME=user
DB_PASSWORD=secret
```

dotenv
CACHE\_DRIVER=database
SESSION\_DRIVER=database
DB\_HOST=gateway-db

````

### 3. Start

Nadaj uprawnienia i uruchom:

```bash
chmod +x start.sh
./start.sh
````

Skrypt:

1. Buduje i uruchamia kontenery (PHP-FPM, Nginx, MySQL)
2. Wykonuje migracje i seedy dla baz

### 4. Dostępne adresy

| Usługa              | URL                                                                      |
| ------------------- | ------------------------------------------------------------------------ |
| API Gateway         | [http://localhost:8080/](http://localhost:8080/)                         |
| User Service API    | [http://localhost:8001/api/users](http://localhost:8001/api/users)       |
| Event Service API   | [http://localhost:8002/api/events](http://localhost:8002/api/events)     |
| Comment Service API | [http://localhost:8003/api/comments](http://localhost:8003/api/comments) |
| Payment Service API | [http://localhost:8004/api/payments](http://localhost:8004/api/payments) |

---

## 🔄 Komunikacja

* **REST API** przez `api-gateway` (Nginx proxy\_pass) zwracające JSON
* **JWT** do autoryzacji (nagłówek `Authorization: Bearer <token>`)

---

## 🧪 Testy

Każdy serwis posiada własne testy:

```bash
cd services/user
vendor/bin/phpunit
```

---

## 🌐 Skalowanie

Możesz skalować mikroserwisy niezależnie:

```bash
docker-compose up -d --scale user-service=3
```

---

## 🧹 Sprzątanie

```bash
docker-compose down -v --remove-orphans
```

---

## 📄 Licencja

MIT License. Szczegóły w pliku [`LICENSE`](./LICENSE).
