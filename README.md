# DesiNest

A full-stack, designer-hotel booking platform built on a **Spring Boot microservices** backend and a **React + Vite** frontend. DesiNest lets hosts list stays, guests search and book them, and payments are settled through Razorpay — with service discovery, an API gateway, JWT + OAuth2 authentication, and async event-driven communication between services via Kafka.

> Internally the project is namespaced `com.eventsphere` (an earlier project name), so you'll see `event-sphere` / `eventsphere` in package names, the DB name, and some config — this is expected and doesn't affect functionality.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Services](#services)
  - [Eureka Server](#1-eureka-server-service-discovery)
  - [API Gateway](#2-api-gateway)
  - [User Service](#3-user-service)
  - [Listing Service](#4-listing-service)
  - [Booking Service](#5-booking-service)
  - [Payment Service](#6-payment-service)
  - [Event Common](#7-event-common)
- [Frontend](#frontend)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Run with Docker Compose (recommended)](#run-with-docker-compose-recommended)
  - [Run services individually (local dev)](#run-services-individually-local-dev)
- [Environment Configuration](#environment-configuration)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Roadmap / Notes](#roadmap--notes)

---

## Architecture

DesiNest follows a classic microservices pattern: each domain (users, listings, bookings, payments) is an independently deployable Spring Boot service, registered with **Eureka** for service discovery and fronted by a single **Spring Cloud Gateway** entry point. Services talk to each other synchronously via **OpenFeign** and asynchronously via **Kafka** for booking/payment status events.

```
                                   ┌─────────────────────┐
                                   │   React Frontend     │
                                   │   (Vite, port 5173)  │
                                   └──────────┬───────────┘
                                              │ HTTP
                                   ┌──────────▼───────────┐
                                   │     API Gateway       │
                                   │   (Spring Cloud       │
                                   │   Gateway, port 8080) │
                                   └──────────┬───────────┘
                                              │ load-balanced (lb://)
                 ┌───────────────┬────────────┼───────────────┬───────────────┐
                 │               │            │               │               │
         ┌───────▼─────┐ ┌───────▼──────┐ ┌───▼────────┐ ┌────▼───────┐
         │ User Service │ │ Listing Svc  │ │Booking Svc │ │Payment Svc │
         │  (8096)      │ │  (8097)      │ │ (8098)     │ │ (8099)     │
         └───────┬──────┘ └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                 │                │  Feign        │  Kafka       │
                 │                └───────────────┴──────────────┘
                 │
         ┌───────▼────────────────────────────────────────────────┐
         │                     PostgreSQL (5432)                   │
         └───────────────────────────────────────────────────────┘

                 All services register with:
         ┌───────────────────────────────────────────┐
         │          Eureka Server (8761)                │
         └───────────────────────────────────────────┘
```

Key interactions:
- **Booking Service** calls **User**, **Listing**, and **Payment** services via Feign clients to validate users/listings and check payment status.
- **Listing Service** calls **Booking** and **User** services via Feign for cross-service checks (e.g. availability).
- **Payment Service** publishes a `PaymentSuccessEvent` to Kafka after a successful Razorpay payment; **Booking Service** consumes it (`PaymentListener`) to confirm the booking. **Booking Service** also has a `BookingProducer` for emitting booking events.
- **Listing Service** uses **Cloudinary** for image upload/storage.
- **User Service** supports both classic email/password login (JWT) and **Google OAuth2** login.

---

## Tech Stack

**Backend**
- Java 21, Spring Boot 3.2.2, Spring Cloud 2023.0.1
- Spring Cloud Gateway, Netflix Eureka (discovery), OpenFeign (inter-service calls)
- Spring Data JPA + PostgreSQL 15
- Spring Security + JWT (`jjwt`), Spring OAuth2 Client (Google login)
- Spring Kafka (async events between booking & payment)
- Spring Mail (booking notification emails)
- Cloudinary SDK (listing image storage)
- Razorpay Java SDK (payments)
- Lombok, ModelMapper
- Maven (multi-module, single root `pom.xml`)

**Frontend**
- React 19 + Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Radix UI primitives + shadcn-style `components/ui`
- Axios for API calls
- `react-toastify` / `sonner` for notifications
- `date-fns`, `react-day-picker` for date handling
- `motion` (Framer Motion) for animation
- ESLint

**Infra**
- Docker + Docker Compose (each service has its own `Dockerfile`)
- PostgreSQL container with health checks
- Kafka/Zookeeper wiring present in `docker-compose.yml` but currently **commented out** (Kafka consumer `auto-startup` is also disabled by default — see [Environment Configuration](#environment-configuration))

---

## Services

The backend is a Maven multi-module project rooted at `/pom.xml`, with modules under `Backend/`.

### 1. Eureka Server (Service Discovery)
`Backend/eureka-server` — Netflix Eureka registry. All other services register themselves here and discover each other by application name (`lb://USER-SERVICE`, etc).
- Port: **8761**
- Dashboard: `http://localhost:8761`

### 2. API Gateway
`Backend/api-gateway` — Spring Cloud Gateway. Single public entry point for the frontend; routes requests to the correct downstream service by path prefix and load-balances via Eureka.
- Port: **8080**
- Routes configured in `application-prod.yml`:

  | Path prefix | Routed to |
  |---|---|
  | `/users/**` | `user-service` |
  | `/auth/**` | `user-service` |
  | `/oauth2/**`, `/login/**` | `user-service` |
  | `/listings/**` | `listing-service` |
  | `/bookings/**` | `booking-service` |
  | `/payments/**` | `payment-service` |

- Global CORS is configured to allow the frontend origin (`FRONTEND_URL`) with credentials.

### 3. User Service
`Backend/user-service` — Authentication and user management.
- Port: **8096**
- Auth: JWT-based (`jjwt`) plus Google OAuth2 login (`OAuth2SuccessHandler`), password auth via `AuthController`, and a token blacklist (`TokenBlacklist` entity) for logout/invalidation.
- Endpoints:
  - `POST /auth/signup` — register a new user
  - `POST /auth/login` — email/password login, issues JWT
  - `POST /auth/logout` — invalidate token
  - `POST /users` — create user
  - `GET /users` — list users
  - `GET /users/{id}` — get user by id
  - `GET /users/curr/me` — get current authenticated user
  - `GET /users/{id}/exists` — check existence (used by other services via Feign)
  - `DELETE /users/{id}` — delete user
- Entities: `User`, `Role`, `AuthProviderType`, `TokenBlacklist`

### 4. Listing Service
`Backend/listing-service` — Hotel/stay listings and image management.
- Port: **8097**
- Images uploaded via multipart form and stored on **Cloudinary**.
- Endpoints:
  - `POST /listings` *(multipart)* — create a listing with images
  - `GET /listings` — list all listings
  - `GET /listings/{id}` — get a listing
  - `GET /listings/user/{id}` — listings owned by a user
  - `PUT /listings/{id}` *(multipart)* — update a listing
  - `DELETE /listings/{id}` — delete a listing
  - `GET /listings/exists/{id}` — existence check (used by Booking Service via Feign)
  - `GET /listings/between-dates` — availability search by date range
  - `GET /listings/by-date` — search by date
  - `GET /listings/search` — general search/filter
  - `POST /file/upload` — standalone file upload endpoint
- Entities: `Listing`, `ListingImage`, `Category`
- Calls **User Service** and **Booking Service** via Feign clients (`UserClients`, `BookingClients`).

### 5. Booking Service
`Backend/booking-service` — Core booking workflow and orchestration.
- Port: **8098**
- Sends booking-confirmation emails via Spring Mail.
- Consumes `PaymentSuccessEvent` from Kafka (`PaymentListener`) to move a booking to confirmed once payment clears; also has a `BookingProducer` for outbound events.
- Endpoints:
  - `POST /bookings` — create a booking
  - `GET /bookings` — list bookings
  - `GET /bookings/{id}` — get a booking
  - `GET /bookings/user/{userId}` — bookings for a user
  - `PUT /bookings/confirm/{bookingId}` — confirm a booking
  - `PUT /bookings/cancel/{bookingId}` — cancel a booking
  - `GET /bookings/booked-listings` — listings that currently have bookings
- Entities: `Booking`, `BookingStatus`
- Calls **User**, **Listing**, and **Payment** services via Feign clients (`UserClients`, `ListingClients`, `PaymentClients`).

### 6. Payment Service
`Backend/payment-service` — Payment processing via Razorpay.
- Port: **8099**
- Endpoints:
  - `POST /payments/create-order` — create a Razorpay order
  - `POST /payments/verify` — verify payment signature/status
- Publishes `PaymentSuccessEvent` to Kafka on success (`PaymentProducer`) for Booking Service to consume.
- Entity: `Payment`

### 7. Event Common
`Backend/event-common` — Shared library module (not a runnable service) used across the backend for cross-service DTOs/events:
- `UserDto`, `ListingResponseDto`, `Category`
- `BookingCreateEvent`, `PaymentSuccessEvent` (Kafka event payloads)

---

## Frontend

`Frontend/` — React 19 SPA built with Vite.

- **Pages** (`src/pages`): `Home`, `HomePage`, `HomePageListing`, `AllListings`, `ListingPage1/2/3` (multi-step listing detail/booking flow), `MyListing`, `MyBooking`, `Booking`, `ViewCard`, `Login`, `SignUp`, `OAuthSuccess` (Google OAuth2 redirect handler), `About`, `Contact`, `ChooseUs`, `Newsletter`, `Footer`.
- **Components** (`src/Component`): `Navbar`, `Card`, `BookingSummary`, `PaymentMethod`, `MessageToHost`, `UpdateListing`.
- **UI primitives** (`src/components/ui`): shadcn/Radix-based reusable components (buttons, inputs, popovers, etc.), styled with Tailwind CSS 4.
- **State/context** (`src/Context`): `AuthContext`, `UserContext`, `ListingContext`, `BookingContext`, `PaymentContext` — React Context providers wrapping API calls (via Axios) to the API Gateway.
- Talks to the backend exclusively through the **API Gateway** (`VITE_APP_API_URL`, e.g. `http://localhost:8080`).

---

## Getting Started

### Prerequisites

- **Java 21** and **Maven** (for running services outside Docker)
- **Node.js** (18+ recommended) and **npm** (for the frontend)
- **Docker** and **Docker Compose** (recommended path — spins up everything)
- Accounts/keys for the external services you want to enable:
  - **PostgreSQL** (bundled in Docker Compose)
  - **Google OAuth2** client (client ID/secret) — for social login
  - **Cloudinary** account — for listing image uploads
  - **Razorpay** account — for payments
  - **SMTP credentials** — for booking confirmation emails

### Run with Docker Compose (recommended)

1. Clone the repo:
   ```bash
   git clone https://github.com/ksajeb/DesiNest.git
   cd DesiNest
   ```

2. Create a `.env` file inside **each** backend service directory that needs one (`Backend/user-service/.env`, `Backend/listing-service/.env`, `Backend/booking-service/.env`, `Backend/payment-service/.env`), based on the `application.yml.example` files described in [Environment Configuration](#environment-configuration).

3. Start everything:
   ```bash
   docker compose up --build
   ```

4. Services will be available at:

   | Service | URL |
   |---|---|
   | Frontend | http://localhost:5173 |
   | API Gateway | http://localhost:8080 |
   | Eureka Dashboard | http://localhost:8761 |
   | User Service | http://localhost:8096 |
   | Listing Service | http://localhost:8097 |
   | Booking Service | http://localhost:8098 |
   | Payment Service | http://localhost:8099 |
   | PostgreSQL | localhost:5432 |

> Note: Kafka/Zookeeper are defined in `docker-compose.yml` but **commented out**. Kafka-dependent behavior (payment → booking confirmation events) will not run until you uncomment those services and re-enable `spring.kafka.listener.auto-startup` in the affected services.

### Run services individually (local dev)

Each backend module can be run standalone with Maven, provided Postgres and Eureka are reachable:

```bash
# from repo root — builds the whole multi-module project
mvn clean install

# then, in separate terminals:
cd Backend/eureka-server && mvn spring-boot:run
cd Backend/api-gateway && mvn spring-boot:run
cd Backend/user-service && mvn spring-boot:run
cd Backend/listing-service && mvn spring-boot:run
cd Backend/booking-service && mvn spring-boot:run
cd Backend/payment-service && mvn spring-boot:run
```

Frontend:
```bash
cd Frontend
npm install
npm run dev
```
Set `VITE_APP_API_URL` (e.g. in a `.env` file or your shell) to point at the API Gateway, e.g. `http://localhost:8080`.

---

## Environment Configuration

Each service ships an `application.yml.example` describing the environment variables it needs. Copy it to `application.yml` (or supply the same variables via an `.env` file / Docker Compose `env_file`, as `docker-compose.yml` already expects `Backend/<service>/.env`).

**User Service** (`Backend/user-service`)
| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth2 login |
| `JWT_SECRET` | Signing key for JWTs |
| `SERVER_PORT` | Default `8096` |
| `EUREKA_SERVER_URL` | Eureka registration URL |

**Listing Service** (`Backend/listing-service`)
| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image storage |
| `PROJECT_IMAGE_PATH` | Local image path config |
| `SERVER_PORT` | Default `8097` |
| `EUREKA_SERVER_URL` | Eureka registration URL |

**Booking Service** (`Backend/booking-service`)
| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` | SMTP for booking emails |
| `SERVER_PORT` | Default `8098` |
| `EUREKA_SERVER_URL` | Eureka registration URL |

**Payment Service** (`Backend/payment-service`)
| Variable | Purpose |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `RAZORPAY_KEY`, `RAZORPAY_SECRET` | Razorpay API credentials |
| `SERVER_PORT` | Default `8099` |
| `EUREKA_SERVER_URL` | Eureka registration URL |

**API Gateway** (`Backend/api-gateway`)
| Variable | Purpose |
|---|---|
| `FRONTEND_URL` | Allowed CORS origin |
| `EUREKA_SERVER_URL` / `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | Eureka registration |
| `PORT` | Default `8080` |

**Frontend** (`Frontend`)
| Variable | Purpose |
|---|---|
| `VITE_APP_API_URL` | Base URL of the API Gateway |

---

## API Overview

All frontend requests go through the API Gateway at `http://localhost:8080`, which forwards to the matching service:

```
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /oauth2/**            (Google OAuth2 flow)

GET    /users
GET    /users/{id}
GET    /users/curr/me
POST   /users
DELETE /users/{id}

GET    /listings
GET    /listings/{id}
GET    /listings/user/{id}
GET    /listings/search
GET    /listings/between-dates
GET    /listings/by-date
POST   /listings                (multipart)
PUT    /listings/{id}           (multipart)
DELETE /listings/{id}

GET    /bookings
GET    /bookings/{id}
GET    /bookings/user/{userId}
GET    /bookings/booked-listings
POST   /bookings
PUT    /bookings/confirm/{bookingId}
PUT    /bookings/cancel/{bookingId}

POST   /payments/create-order
POST   /payments/verify
```

---

## Project Structure

```
DesiNest/
├── Backend/
│   ├── api-gateway/          # Spring Cloud Gateway – single entry point + routing/CORS
│   ├── eureka-server/        # Netflix Eureka – service discovery
│   ├── user-service/         # Auth (JWT + Google OAuth2), user management
│   ├── listing-service/      # Listings CRUD, search, Cloudinary image uploads
│   ├── booking-service/      # Booking lifecycle, email notifications, Kafka consumer
│   ├── payment-service/      # Razorpay integration, Kafka producer
│   └── event-common/         # Shared DTOs & Kafka event payloads (library module)
├── Frontend/
│   ├── src/
│   │   ├── pages/            # Route-level views (Home, Listings, Booking, Auth, etc.)
│   │   ├── Component/        # Reusable feature components
│   │   ├── components/ui/    # shadcn/Radix-based UI primitives
│   │   ├── Context/          # React Context providers (Auth, User, Listing, Booking, Payment)
│   │   ├── lib/               # Utilities
│   │   └── assets/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml         # Orchestrates Postgres, Eureka, Gateway, all services, frontend
└── pom.xml                    # Root Maven multi-module build
```

---

## Roadmap / Notes

- Kafka/Zookeeper containers are stubbed out (commented) in `docker-compose.yml` and Kafka listener auto-start is disabled by default in `booking-service` — enable both to activate the async payment → booking confirmation flow.
- The project's internal package namespace (`com.eventsphere`) and DB name (`event-sphere`) reflect an earlier project name and can be renamed for a fully "DesiNest"-branded codebase without affecting behavior.
- No automated test suite beyond the default Spring Boot `spring-boot-starter-test` scaffolding was found — contributions adding integration tests for the booking↔payment Kafka flow and Feign-client interactions would be valuable.

---

## License

No license file is currently included in this repository. Add one (e.g. MIT, Apache 2.0) if you intend for others to reuse this code.
