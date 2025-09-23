# Monitoring and Logging Service API

- Base path: `/api/v1`
- Docs: `/docs`
- Security: Bearer JWT (RS256) with roles claim (roles array or scope string), or `X-API-Key` for ingestion only.

Roles:
- ingest: can POST /logs, /metrics
- viewer: can GET /dashboard
- analyst: can GET/POST alerts, GET rules, POST rules, GET compliance reports
- admin: all of the above plus DELETE rules

Endpoints:
- POST /api/v1/logs
- POST /api/v1/metrics
- GET /api/v1/alerts
- POST /api/v1/alerts
- PATCH /api/v1/alerts/{id}/resolve
- GET /api/v1/alerts/rules
- POST /api/v1/alerts/rules
- DELETE /api/v1/alerts/rules/{id}
- GET /api/v1/dashboard
- GET /api/v1/compliance/audit?from=&to=
