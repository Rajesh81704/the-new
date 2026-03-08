# ConnectPro Developer Guide

## Repository Structure

The repository has been structured as a monorepo containing both the frontend and backend applications.

```
connectpro/
├── frontend/       # React (Vite) + Tailwind CSS + shadcn/ui application
├── backend/        # Node.js + Express + TypeScript + Prisma backend
└── package.json    # Root package.json with helper scripts
```

## Current Project Status

**IMPORTANT:** The full Full-Stack integration is **NOT** yet complete. Here is the exact status:

### 1. Frontend (Done)
- The UI components and pages are built.
- It is currently using Mock Data/Contexts (e.g., in `frontend/src/lib/`).
- It is not yet making real API calls to the backend.

### 2. Backend (Scaffolded, Not Implemented)
- The Node.js + Express structure is set up.
- Code architecture (Controllers, Services, Error Handling) is configured.
- The **API Endpoints** (Auth, Post creation, Admin functionalities) are **NOT YET WRITTEN**.

### 3. Database (Schema Designed, Not Created)
- The PostgreSQL `schema.prisma` is written in `backend/prisma/schema.prisma` with all multi-tenant tables.
- The actual physical database is **NOT CREATED** yet because we haven't set up the `DATABASE_URL` and run the migrations.

### 4. API Connection (Not Started)
- We still need to replace the React Contexts in the Frontend with `fetch` or `axios` calls (via React Query) to hit the backend APIs.

---

## Next Steps for Development

To complete the application, follow these steps in order:

### Step 1: Initialize the Database
1. Set up a PostgreSQL database (locally via Docker/Postgres.app, or cloud like Neon/Supabase).
2. Create a `.env` file in the `backend/` folder and add:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/connectpro?schema=public"
   PORT=8080
   JWT_SECRET="your_secret_key"
   ```
3. Run the Prisma migration to create tables:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### Step 2: Implement Backend API Endpoints
1. Create Authentication endpoints (`POST /api/auth/register`, `POST /api/auth/login`).
2. Create endpoint controllers and services inside `backend/src/controllers` and `backend/src/services`.
3. Add these routes to `backend/src/app.ts`.

### Step 3: Connect Frontend to Backend (API Connection)
1. In `frontend/`, create an API client (e.g., `src/lib/api.ts`) pointing to `http://localhost:8080`.
2. Replace the dummy Context providers (like `PostsProvider`, `ProfileProvider`) with real React Query mutations/queries that hit the backend routes.

---

## How to Run Development Servers Locally

**1. Install all dependencies:**
From the root folder run:
```bash
npm run install:all
```

**2. Run Frontend and Backend simultaneously (Open 2 terminal tabs):**

*Terminal 1 - Frontend:*
```bash
npm run dev:frontend
# Runs Vite on http://localhost:8081 (or similar)
```

*Terminal 2 - Backend:*
```bash
npm run dev:backend
# Runs Node API on http://localhost:8080
```
