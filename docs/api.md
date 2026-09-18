# API Contracts

Base URL: `/api/v1`

## Health

`GET /health`

Returns service health. This endpoint does not require authentication in development.

## Business

`GET /api/v1/business`

Returns the tenant business profile used by the owner dashboard.

## Phase 1 planned resource contracts

- `GET|POST /leads`
- `GET|POST /customers`
- `GET /services`
- `GET /availability`
- `GET|POST /bookings`
- `GET|POST /quotes`
- `GET|POST /invoices`
- `POST /payment-requests`
- `POST /payments/webhooks/:provider`
- `GET /projects`
- `GET /reports/ceo-briefing`

All future mutation endpoints must validate tenant context, permissions, request data, and audit requirements before writing to PostgreSQL.
