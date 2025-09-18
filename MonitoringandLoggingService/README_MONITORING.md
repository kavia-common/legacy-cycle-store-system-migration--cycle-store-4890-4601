# Monitoring and Logging Service

This service ingests logs and metrics, evaluates alert rules, and serves dashboard data.
It exposes secure REST endpoints with JWT/role-based access and supports API-key ingestion for agents.

Roles (hierarchy): viewer < analyst < operator < admin

- Ingest logs/metrics: operator or API key (x-api-key == MONITORING_INGEST_API_KEY)
- Query alerts, dashboard: analyst+
- Manage rules: admin

Quick start:
1. Copy .env.example to .env and set MONITORING_INGEST_API_KEY
2. npm install
3. npm run dev
4. Open /docs for Swagger UI

Posting a log:
curl -X POST http://localhost:3000/logs -H 'Content-Type: application/json' -H 'x-api-key: KEY' -d '{
  "timestamp":"2024-01-01T00:00:00.000Z","level":"ERROR","message":"boom","source":"BusinessLogicService","context":{"traceId":"abc"} }'

Posting a metric:
curl -X POST http://localhost:3000/metrics -H 'Content-Type: application/json' -H 'x-api-key: KEY' -d '{
  "timestamp":"2024-01-01T00:00:00.000Z","name":"http_requests_total","value":42,"labels":{"service":"API","route":"/orders"}}'

Creating a rule (JWT required; admin role):
POST /alerts/rules
{
  "id":"r1","name":"High HTTP Requests","expression":"metric:http_requests_total > 100","enabled":true,"severity":"MEDIUM"
}

This demo uses in-memory buffers; replace services/store.js with an Elasticsearch adapter for ELK integration.
