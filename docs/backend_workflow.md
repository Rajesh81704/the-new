# ConnectPro Backend Workflow Documentation

This document outlines the architectural patterns and request-response lifecycle of the ConnectPro backend to assist developers in understanding and extending the system.

## 🏗 Architecture Overview
The backend is built with **Node.js** and **Express.js** using **TypeScript**. It follows a **Layered Architecture** pattern:

1.  **Routes Layer (`/src/routes`)**: Defines API endpoints and attaches middleware.
2.  **Middleware Layer (`/src/middleware`)**: Handles authentication, role-based access control (RBAC), and request validation.
3.  **Controllers Layer (`/src/controllers`)**: Orchestrates the request, calls services, and formats the response. Inherits from `BaseController` for consistent success/error handling.
4.  **Services Layer (`/src/services`)**: Contains the core business logic and interacts with the database.
5.  **Data Layer (Prisma)**: Uses Prisma ORM with PostgreSQL for type-safe database operations.

---

## 🔐 Authentication & Multitenancy

### Authentication
- Uses **JWT (JSON Web Tokens)** for stateless authentication.
- Auth middleware verifies the `Authorization: Bearer <token>` header.
- Decoded payload is attached to `req.user`, containing `userId`, `role`, and `companyId`.

### Multitenancy Logic
- **Tenant Identification**: Every record (Posts, Events, Blogs, etc.) is linked to a `companyId`.
- **Data Isolation**: Controllers extract `companyId` from the authenticated user context to filter queries.
- **Database Uniqueness**: Users are unique per `(email, companyId)`, allowing the same email to exist across different communities independently.

---

## 🔄 Request Lifecycle (Example: Creating a Post)

1.  **Frontend**: Sends `POST /api/posts` with content and Bearer token.
2.  **Router**: `postRoutes.ts` catches the request and applies `authenticate` middleware.
3.  **Middleware**: `authMiddleware.ts` validates the JWT and injects user info into `req`.
4.  **Controller**: `PostController.createPost` extracts `companyId` and `authorId` from `req.user`.
5.  **Service**: `postService.createPost` performs the Prisma create operation:
    ```typescript
    await prisma.post.create({
      data: { content, authorId, companyId, ... }
    });
    ```
6.  **Response**: Controller uses `this.handleSuccess()` to send a standardized JSON response.

---

## 📂 Key Directories
- `src/controllers`: Request handlers (e.g., `UserController.ts`, `AdminController.ts`).
- `src/services`: Business logic (e.g., `authService.ts`, `postService.ts`).
- `src/middleware`: `authMiddleware.ts` for security.
- `prisma/schema.prisma`: The single source of truth for the database schema.
- `src/app.ts`: Express application setup and middleware registration.

---

## 🛠 Developer Commands
- **Install Dependencies**: `npm install`
- **Database Migration**: `npx prisma migrate dev`
- **Prisma Studio**: `npx prisma studio` (to view data)
- **Dev Server**: `npm run dev`
