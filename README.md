# Face-Mobile-Hospital App

This repository now contains:

- **Front-end static web app** (existing HTML/CSS screens under `Face Web App/`)
- **Backend API** built with **Express + MySQL** under `backend/`

## Backend stack

- Node.js + Express
- MySQL (`mysql2`)
- JWT authentication
- Role-based access (`admin`, `doctor`)

## Backend setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your MySQL credentials.

3. Create database and tables:

   ```bash
   mysql -u root -p < sql/schema.sql
   ```

4. Run the API:

   ```bash
   npm run dev
   ```

API base URL: `http://localhost:5000/api`

## Main API endpoints

- `POST /api/auth/login` — login and get JWT token
- `GET /api/health` — health check
- `GET/POST/PUT /api/patients` — patient management
- `GET/POST/PUT /api/stock` — medicine stock management
- `GET/POST /api/sales` — drug sales tracking

> Protected endpoints require `Authorization: Bearer <token>` header.

## Seed users

From `schema.sql`:

- **admin / admin123**
- **doctor / doctor123**
