# Magically Super — Changelog

All notable changes made to the platform are documented here.

---

## [v3] — 2026-03-09 — Branding, Logo Uploads & Dynamic Headers

### ✨ Features
- **App rebranded** from "NetLink" to **"Magically Super"** across all pages (`LoginPage`, `AppHeader`, `AdminLayout`, `CompanyLandingPage`, `TermsPage`, `SuperAdminSettings`, `PublicCardPage`, `index.html` title).
- **Contextual Login Page Messaging**: Each subdomain's login page now shows a specific badge, headline, and description in Hindi-English mix:
  - `user.*` → "👤 Member Login Portal" — explains that users log in as a company member with their Company ID.
  - `company.*` → "🏢 Company Admin Portal" — explains admins manage their company dashboard here.
  - `admin.*` → "🛡️ Super Admin Portal" — explains only master admins can access this.
- **Dynamic Company Branding in AppHeader**: Header now reads `companyName` and `companyLogo` from `localStorage`. If a logo is uploaded, it replaces the text entirely with the brand image.
- **Real logged-in user name** shown in the header dropdown (decoded from JWT), replacing the hardcoded "Alex Johnson" placeholder.
- **Functional Logout button**: Clears all `localStorage` and redirects to `/login`.
- **Company Logo Upload** (Admin Settings → Branding tab):
  - New "Branding" tab is the first and default tab in Admin Settings.
  - File-picker with live preview, uploads via `POST /api/admin/settings/logo`.
  - Logo URL saved to Prisma DB (`companies.logoUrl`) and updated in `localStorage` immediately.

### 🗄️ Backend Changes
- **`prisma/schema.prisma`**: Added `logoUrl String?` field to the `Company` model.
- **`multer` installed**: `npm i multer @types/multer` for multipart file uploads.
- **`backend/src/middleware/upload.ts`** (NEW): Multer middleware with disk storage to `backend/uploads/`, image-only file filter, 5MB size limit, unique timestamped filenames.
- **`backend/src/app.ts`**: Added `express.static` route to serve `/uploads` directory over HTTP.
- **`backend/src/services/adminService.ts`**: Added `updateCompanyLogo(companyId, logoUrl)` Prisma update method.
- **`backend/src/controllers/AdminController.ts`**: Added `uploadLogo()` handler.
- **`backend/src/routes/adminRoutes.ts`**: Added `POST /settings/logo` with Multer middleware.
- **`backend/src/services/authService.ts`** (login): Now returns `company: { name, logoUrl }` alongside the JWT token so the frontend can cache branding on login.

### 💾 Persistent VPS Storage (Git-Safe)
- **`backend/uploads/.gitignore`** (NEW): Contains `*` + `!.gitignore` — the folder is tracked in git (so it exists on the VPS) but all uploaded files are fully ignored. A `git pull` will **never** delete or corrupt uploaded images.

---

## [v2] — 2026-03-09 — Multi-Tenant Auth & Company Code System

### ✨ Features
- **Auto-generated Company Code**: When a Super Admin creates a company, a unique `companyCode` is auto-generated as `COMPANYNAME+YEAR` (e.g., `TECHNETINDIA2026`). Suffix counter handles collisions.
- **Multi-Tenant Login**: One email can belong to multiple companies. Users/admins log in with `email + password + companyCode`. Super Admins log in without a company code.
- **Subdomain-aware Company ID field**: The `companyCode` input only appears on `user.*` and `company.*` subdomains — hidden on `admin.*`.

### 🗄️ Backend Changes
- **`prisma/schema.prisma`**:
  - Added `companyCode String @unique` to `Company` model.
  - Changed `User.email` from `@unique` to composite `@@unique([email, companyId])`.
- **`authService.ts`**: `login()` and `forgotPassword()` now look up company by `companyCode` first, then find user by `email + companyId`.
- **`superAdminService.ts`**: Auto-generates `companyCode` on `createCompany()`.
- **`auth.schema.ts`**: Made `companyCode` optional in login/forgotPassword validators.

---

## [v1] — 2026-03-08/09 — Authentication, Landing Pages & Real-Time Data

### ✨ Features
- **Subdomain-based routing**: `user.*` → User app, `company.*` → Admin panel, `admin.*` → Super Admin panel. Managed in `App.tsx` via `getAppVariant()`.
- **Landing Pages**: Created `UserLandingPage`, `CompanyAdminLandingPage`, `SuperAdminLandingPage`.
- **Login & Auth Pages**: Premium glassmorphism design for `LoginPage`, `ForgotPasswordPage`, `ResetPasswordPage` with framer-motion animations, icon-enhanced inputs, "Reset via Mail OTP" button.
- **Protected Routes**: `ProtectedRoute` component guards all internal routes — redirects to `/login` if no JWT token is present.
- **Signup pages removed**: No public signup flows exist anywhere in the app.
- **Password Reset via Email**: Backend `forgotPassword` generates a secure token and sends a reset link via `nodemailer` (`emailService.ts`). `resetPassword` validates the token and updates the hash.

### 🗄️ Backend Changes
- **`prisma/schema.prisma`**: Added `resetToken` and `resetTokenExpiry` fields to `User` model.
- **`authRoutes.ts`**: Added `/forgot-password` and `/reset-password` endpoints.
- **`authService.ts`**: Full `forgotPassword` and `resetPassword` implementations.
- **`emailService.ts`** (NEW): Nodemailer-based email sender for password reset links.

### 🚫 Mock Data Removed
- `HomePage.tsx`, `FriendsPage.tsx` — feed data from real backend.
- `AdminDashboard.tsx`, `AdminMembers.tsx` — stats and member list from API.
- `SuperAdminDashboard.tsx`, `SuperAdminCompanies.tsx` — company list and counts from API.
- All admin content pages (Events, Blogs, Resources, Podcasts) — real DB fetch, empty state shown when no data exists.

### 🎨 UI / UX
- **Favicon removed** — Lovable default `.ico` deleted; replaced with an inline SVG data URL in `index.html` to force browser cache invalidation.
