# Blue Sine Music Studios Management

Phase 1 foundation for Blue Sine Music Studios: a tenant-aware recording-studio management platform.

## Stack

- React + TypeScript + Vite
- Fastify + TypeScript REST API
- PostgreSQL + Drizzle ORM
- Zod contracts
- Redis/BullMQ extension point
- AI provider and payment/storage adapters

## Development

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

The default development integrations are explicitly simulated. They do not send real WhatsApp messages, emails, or payments.

## Phase 1 lifecycle

Lead → Customer → Booking → Quote → Invoice → Verified payment → Project → Session → Follow-up → CEO briefing

See `docs/architecture.md` and `docs/api.md` for the implementation plan.
