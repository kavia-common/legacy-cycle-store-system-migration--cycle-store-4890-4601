# Security and RBAC

- JWT RS256 verification via `JWT_PUBLIC_KEY`
- Roles resolved from `roles` array claim or `scope` space-separated string.
- API key-based ingestion with `X-API-Key` for agents that cannot sign JWT.
- Enforced RBAC per route using middleware `requireRoles`.

Audit events are recorded in-memory (`models/store.js`) for this reference implementation. Replace with durable store for production.
