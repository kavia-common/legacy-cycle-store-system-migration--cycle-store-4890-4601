# Monitoring and Logging Service — Integration Notes

This service currently stores logs and metrics in memory and (optionally) appends JSON lines to files in `DATA_DIR` when `PERSIST_TO_FILE=true`.

Production integration points:
- ELK/Elastic: replace `src/services/storage.js` list/add methods to index documents into Elasticsearch (e.g., via official client). Keep correlationId in each document for traceability.
- Prometheus: expose a `/metrics/prometheus` text endpoint or push metrics to a Pushgateway (see `PROMETHEUS_PUSHGATEWAY_URL`). Current implementation accepts metrics via `/metrics` and stores them in memory for demo.
- Notification Service: configure `NOTIFICATION_SERVICE_URL` and optional `NOTIFICATION_SERVICE_TOKEN`. High/Critical alerts will POST a notification payload to `/notifications/send`.

Correlation ID:
- The middleware reads or sets the `x-correlation-id` header (configurable via `CORRELATION_ID_HEADER`) and attaches it to responses and persisted data. Propagate this header across services for end-to-end tracing.
