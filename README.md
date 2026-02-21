<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Backend Boilerplate</h1>

<p align="center">
  A production-ready NestJS boilerplate implementing Clean Architecture with Use Cases, Repository Pattern, JWT Authentication, Role-based access control, and a modular Admin panel.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-E0234E?style=flat&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Modules](#modules)
- [Database](#database)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

---

## Overview

This boilerplate provides a solid and scalable foundation for building NestJS backend applications. It follows Clean Architecture principles, separating business logic (Use Cases) from infrastructure concerns (Repositories), making the codebase easy to maintain, test, and extend.

**Key features:**
- ✅ JWT Authentication (access + refresh tokens)
- ✅ Role-based access control (`ADMIN` / `USER`)
- ✅ Permission-based authorization for the admin panel
- ✅ Use Case + Repository pattern throughout
- ✅ File upload support (AWS S3 ready)
- ✅ Email sending via Nodemailer / SendGrid
- ✅ Handlebars email templates
- ✅ Argon2 password hashing
- ✅ Pagination utilities
- ✅ Swagger (OpenAPI) documentation
- ✅ Prisma ORM with PostgreSQL

---

## Architecture

The project follows a **Clean Architecture** approach with the following layers:

```
Controller  →  Use Case (abstract + concrete)  →  Repository (abstract + concrete)  →  Database
```

- **Controllers** handle HTTP requests/responses and access control checks.
- **Use Cases** contain all business logic and are the single source of truth for each operation.
- **Repositories** abstract all database access via Prisma, making it easy to swap implementations.
- **DTOs** validate input and shape output at every layer.

---

## Modules

| Module | Description |
|---|---|
| `prisma` | Global Prisma client service |
| `crypto` | Password hashing using Argon2 |
| `template` | Email template rendering using Handlebars |
| `mailer` | Email sending (Nodemailer + SendGrid) |
| `upload` | File upload to AWS S3 |
| `user` | User registration |
| `auth` | Login, refresh token, confirm account, forgot/reset password |
| `admin/admin-settings` | Admin CRUD (create, find, update admins, manage permissions) |
| `admin/admin-users` | User management by admins (list, find, toggle status) |
| `admin/admin-dashboard` | Admin dashboard entry point |
| `admin/shared` | Shared DTOs and repository used across admin submodules |

---

## Database

The application uses **PostgreSQL** via **Prisma ORM**.

### Models

**User**
- Stores both `ADMIN` and `USER` roles in a single table
- `status`: `REGISTERED` → `CONFIRMED` → `INACTIVE`
- Linked to `AdminPermission` for admin-specific access control

**AdminPermission**
- Available permissions: `DASHBOARD`, `SETTINGS`, `USERS`
- Many-to-many relationship with `User`

### Seeding

```bash
cd backend
npx prisma db seed
```

The seed creates:
- A default admin user with all permissions
- A default regular user
- All three `AdminPermission` records

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- A `.env` file based on `.env.example`

### Installation

```bash
# Clone the repository
git clone https://github.com/igopereira1/nestjs-backend-template.git
cd nestjs-backend-template/backend

# Install dependencies
npm install

# Set up your environment variables
cp .env.example .env

# Run Prisma migrations
npx prisma migrate deploy

# Seed the database (optional)
npx prisma db seed

# Start development server
npm run start:dev
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```env
# Database
DB_DRIVER="postgresql"
DB_HOST="your-db-host"
DB_PORT="your-db-port"
DB_USER="your-db-user"
DB_PASSWORD="your-db-password"
DB_DATABASE="your-db-name"
DATABASE_URL="${DB_DRIVER}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

# JWT
JWT_SECRET="your-jwt-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"
ACCESS_TOKEN_EXPIRES="15m"
REFRESH_TOKEN_EXPIRES="7d"

# Email — choose the provider via MAIL_SERVICE ('nodemailer' or 'sendgrid')
MAIL_SERVICE="nodemailer"

# SendGrid
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="your-sendgrid-from-email"

# Nodemailer (SMTP)
MAIL_HOST="your-smtp-host"
MAIL_PORT="your-smtp-port"
MAIL_SECURE="false"
MAIL_USER="your-mail-user"
MAIL_PASSWORD="your-mail-password"
MAIL_FROM="your-mail-from"

# AWS S3
AWS_REGION="your-aws-region"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_BUCKET_NAME="your-bucket-name"
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api/docs
```

All routes are documented with input/output schemas and security requirements.

> **Global prefix**: All API routes are served under `/api/v1`. For example: `POST /api/v1/auth/login`.

### Authentication strategy

**On login**, the API sets an HTTP-only cookie `access_token` and also returns the tokens in the response body.

**On subsequent requests**, the `JwtStrategy` extracts the token with the following priority:
1. **Cookie** `access_token` (preferred — browsers send this automatically)
2. **Authorization header** `Bearer <token>` (fallback — useful for Postman/API clients)

The `JwtAuthGuard` is applied globally — routes can opt out with the `@IsPublic()` decorator.

### Auth Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/login` | Login and receive access + refresh tokens |
| `POST` | `/auth/refresh-token` | Refresh access token |
| `POST` | `/auth/confirm-account` | Confirm user account via code |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with code |
| `POST` | `/auth/validate-tokens` | Validate access and refresh tokens |

### User Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/user` | Create a new user account |

### Admin Dashboard Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/admin-dashboard` | Admin dashboard entry point (requires `DASHBOARD` permission) |

### Admin Settings Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/admin-settings/all-permissions` | List all available permissions (public) |
| `POST` | `/admin-settings` | Create a new admin (requires `SETTINGS` permission) |
| `GET` | `/admin-settings` | List all admins (requires `SETTINGS` permission) |
| `GET` | `/admin-settings/:id` | Get admin by ID (requires `SETTINGS` permission) |
| `PATCH` | `/admin-settings/:id` | Update admin by ID (requires `SETTINGS` permission) |

### Admin Users Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/admin-users` | List all users (requires `USERS` permission) |
| `GET` | `/admin-users/:id` | Get user by ID (requires `USERS` permission) |
| `PATCH` | `/admin-users/:id/toggle-status` | Toggle user active status (requires `USERS` permission) |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Database seeder
│   └── seeds/                # Individual seed files
├── src/
│   ├── decorators/           # Custom decorators (CurrentUser, IsPublic)
│   ├── guards/               # JWT Auth Guard
│   ├── utils/                # HandleAccessControl utility
│   ├── modules/
│   │   ├── prisma/           # Prisma service
│   │   ├── crypto/           # Argon2 hashing
│   │   ├── template/         # Handlebars templates
│   │   ├── mailer/           # Email service
│   │   ├── upload/           # S3 file upload
│   │   ├── pagination/       # Page DTOs and interfaces
│   │   ├── user/             # User module
│   │   ├── auth/             # Auth module
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── shared/       # Shared DTOs and repository
│   │       ├── admin-dashboard/
│   │       ├── admin-settings/
│   │       └── admin-users/
│   ├── app.module.ts
│   └── main.ts
└── .env.example
```

---

## Scripts

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Linting
npm run lint

# Tests
npm run test          # unit tests
npm run test:e2e      # e2e tests
npm run test:cov      # test coverage

# Prisma
npx prisma studio     # open Prisma Studio
npx prisma migrate dev --name <migration-name>
npx prisma db seed
```

---

## License

This project is [MIT licensed](./LICENSE).
