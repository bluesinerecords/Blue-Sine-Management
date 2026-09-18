# Phase 1 Architecture

Blue Sine is a multi-tenant recording-studio management platform.

## Connected lifecycle

Lead → Customer → Booking → Quote → Invoice → Verified payment → Project → Session → Follow-up → CEO briefing

## Boundaries

- React web application in `apps/web`
- Fastify API in `apps/api`
- PostgreSQL migrations in `database/migrations`
- Provider adapters in `apps/api/src/ai` and `apps/api/src/integrations`
- API contracts and architecture documentation in `docs`

## Safety rules

Development adapters are explicit simulations. No simulated payment, email, WhatsApp message, or file transfer is presented as a real external action. Prices come from the service catalogue. Financial, rights, and high-risk customer actions require authorization and approval.
