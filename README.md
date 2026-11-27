This is a fork of the original repository.

This repo is private for security and privacy reasons.

## Run locally

### Requirements

- Node.js 20.9 or later
- npm

### Install and start

From the repository root, install the locked dependencies:

```powershell
npm ci
```

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

Generate a unique Auth.js secret and put the result in `AUTH_SECRET` in `.env.local`:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Then start the development server:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The administrator sign-in page is at `/login`.

### Authentication configuration

Authentication is fail-closed until configured. To enable organization SSO, set these values in `.env.local` using details from the identity-provider administrator:

- `AUTH_OIDC_ISSUER`
- `AUTH_OIDC_CLIENT_ID`
- `AUTH_OIDC_CLIENT_SECRET`
- `AUTH_OIDC_ROLE_CLAIM` (defaults to `role`)

The role claim must exactly match an approved role ID in `lib/auth/rbac.ts`. Register the callback URL `/api/auth/callback/barangay-oidc` with the provider. Email/password sign-in remains disabled until its account repository is connected to the selected database. Never commit `.env.local`, real secrets, or production credentials.

Only set `AUTH_TRUST_HOST=true` in production when the trusted reverse proxy validates and overwrites incoming `Host` headers. Local development does not require this setting.

## Project and backend status

This is a Next.js 16 App Router application for Barangay Sta. Lucia. It includes an administrative dashboard and modules for inhabitants, certificates, helpdesk/blotter, assets, disaster resilience, gender and development, ordinances, public portal content, development planning, institutions, and financial management.

The backend foundation currently provides:

- Auth.js JWT sessions, optional OIDC sign-in, and server-side role checks.
- A draft role/permission matrix and restricted VAWC UI access.
- API response and request-validation helpers.
- `GET /api/v1/health`, a public liveness check.
- `GET /api/v1/auth/capabilities`, which reports whether sign-in configuration is present.

The database vendor and hosted DaaS are not yet selected. `DATABASE_URL` is a configuration placeholder; no database driver or migration runner is connected, and application data is not yet persisted. Quarter 3 adds the provider-neutral administrator data model and initial schema at `db/migrations/0001_admin_accounts.sql`. Review and apply/adapt that migration for the selected DaaS before using it. Email/password sign-in remains disabled until a database-backed account repository is connected. Existing module screens still use frontend/mock state and should not be treated as persistent records.

The initial schema defines administrator accounts and security audit events. IDs and UTC epoch-millisecond timestamps are supplied by the application. Audit-event details must be minimized and must not contain passwords, tokens, or unnecessary personal/sensitive information. No administrator accounts are seeded by the migration.

## Validation and production build

Run the production build:

```powershell
npm run build
```

Run ESLint:

```powershell
npm run lint
```

The repository currently has no dedicated automated test script. For a production-mode local check, build first and then run:

```powershell
npm run start
```

The app serves on [http://localhost:3000](http://localhost:3000) by default. Configure a real Auth.js secret and the appropriate identity-provider values in the deployment environment before enabling sign-in. Do not expose production services until the database integration, persistent data paths, and deployment security settings have been completed and reviewed.
