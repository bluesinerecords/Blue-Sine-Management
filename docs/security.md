# Security Notes

- Never commit `.env` or provider credentials.
- Payment records become verified only through a verified provider webhook.
- Tenant scope must be applied to every repository query.
- Financial, rights, deletion, discount, refund, and external messaging actions must be audited.
- Development providers are labelled as simulated.
- Production deployment should add secure sessions, rate limiting, CSRF protection, signed file URLs, webhook signatures, malware scanning, and PostgreSQL row-level security.
