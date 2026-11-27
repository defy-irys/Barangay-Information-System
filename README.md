This is a fork of the original repository.


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
- Hybrid authorization groundwork: RBAC permissions combined with assigned barangay-scope attributes and resource-classification checks.
- API response and request-validation helpers.
- `GET /api/v1/health`, a public liveness check.
- `GET /api/v1/auth/capabilities`, which reports whether sign-in configuration is present.
- Quarter 4 resident API contracts for listing, creating, reading, and updating resident records.

The database vendor and hosted DaaS are not yet selected. `DATABASE_URL` is a configuration placeholder; no database driver or migration runner is connected, and application data is not yet persisted. The provider-neutral schema is in `db/migrations/0001_admin_accounts.sql`, `db/migrations/0002_residents.sql`, and `db/migrations/0003_hybrid_access_scopes.sql`. Review and apply/adapt all three migrations for the selected DaaS before using them. The resident API routes enforce session-derived HBAC and validate input, but return `503 SERVICE_UNAVAILABLE` until a persistent database adapter is connected. No in-memory or mock storage is used as a fallback. Email/password sign-in remains disabled until a database-backed account repository is connected. Existing module screens still use frontend/mock state and are not yet wired to these routes.

The schema defines administrator accounts, security audit events, the resident registry, barangay scopes, and administrator/resident scope assignments. Apply migrations in numeric order. IDs and UTC epoch-millisecond timestamps are supplied by the application. The resident schema intentionally excludes national identity numbers, health details, religion, voter data, photos, and sectoral/sensitive case records. Audit-event details must be minimized and must not contain passwords, tokens, or unnecessary personal/sensitive information. No administrator accounts, residents, or barangay scopes are seeded by the migrations.

The resident API contract is:

- `GET /api/v1/residents?search=...&limit=25&offset=0` — requires `inhabitants:read`; page size is capped at 100.
- `POST /api/v1/residents` — requires `inhabitants:create`; validates the submitted resident profile, including an assigned `barangayScopeId`.
- `GET /api/v1/residents/{id}` — requires `inhabitants:read`.
- `PATCH /api/v1/residents/{id}` — requires `inhabitants:update`; requires at least one valid field.

All routes require an authenticated administrator session. In addition to the required role permission, resident reads and updates must be constrained to the administrator’s assigned scope IDs; create requests must name a scope assigned to that administrator. The database adapter must verify active subject/scope assignments and that a resident’s address belongs to the selected scope, apply scope filters in its queries, and commit create/update audit events atomically. Until the adapter is connected, these routes return `503 SERVICE_UNAVAILABLE`; they never report success or fall back to process-local data.

### Hybrid access control (HBAC)

Access requires both the existing role permission (RBAC) and validated subject/resource attributes (ABAC). Authenticated sessions carry a list of assigned barangay-scope UUIDs. OIDC deployments must configure `AUTH_OIDC_SCOPE_CLAIM` (default `barangay_scope_ids`) to return those UUIDs; credential accounts must obtain active assignments from `admin_user_scopes`. Missing or malformed scope attributes prevent sign-in. Resident repository operations must constrain every query by the session’s allowed scope IDs, join active resident/scope assignments, and treat out-of-scope item lookups as not found. Restricted VAWC resources require the specific `vawc:*` permission and matching classification; a broad helpdesk permission is insufficient. Scope assignment changes must be audited and should trigger session revocation when the persistent identity adapter is available. Assignments are not seeded; create and review them through trusted provisioning after migrations are adapted to the selected DaaS.

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
