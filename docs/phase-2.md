# Phase 2 Connected Lifecycle

## Implemented

- Tracked PostgreSQL migrations and repeatable seed data
- Session authentication utilities and owner role foundation
- Tenant-scoped API routes
- Database-backed business profile and active service price lookup
- Lead and customer creation/listing
- Availability queries and transactional booking creation
- Quote items, catalogue-derived prices, discounts, and quote acceptance
- Invoice creation from accepted quotes
- Simulated payment requests and idempotent verified mock webhook flow
- Projects, songs, recording sessions, and follow-ups
- Dashboard metrics from live database queries
- Audit and outbox records for booking creation
- Explicitly simulated external payment behavior

## Main endpoints

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET|POST /api/v1/leads`
- `GET|POST /api/v1/customers`
- `GET /api/v1/services`
- `GET /api/v1/availability`
- `POST /api/v1/bookings`
- `POST /api/v1/quotes`
- `POST /api/v1/quotes/:id/accept`
- `POST /api/v1/payments/request`
- `POST /api/v1/payments/webhooks/mock`
- `GET|POST /api/v1/projects`
- `POST /api/v1/projects/:id/songs`
- `POST /api/v1/sessions`
- `POST /api/v1/follow-ups`
- `GET /api/v1/dashboard/summary`

## Validation

The GitHub connector can inspect and write repository files but cannot execute local installs, migrations, TypeScript builds, lint, or tests. Run those checks in CI or locally before merging.
