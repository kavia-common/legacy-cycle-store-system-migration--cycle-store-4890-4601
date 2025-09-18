'use strict';

const { logs, metrics } = require('./store');
const { writeAudit } = require('./audit');

/**
 * PUBLIC_INTERFACE
 * ingestLog
 * Ingest a log record in ELK-compatible shape.
 */
function ingestLog(payload, principal, req) {
  /** Accepts a log object and stores it into log buffer. */
  const record = {
    '@timestamp': payload.timestamp,
    level: payload.level,
    message: payload.message,
    source: payload.source,
    context: payload.context || {},
    receivedAt: new Date().toISOString(),
  };
  logs.push(record);
  writeAudit({
    actor: principal?.subject || 'unknown',
    action: 'log.ingest',
    resource: record.source,
    details: { level: record.level, ip: req.ip },
  });
  return record;
}

/**
 * PUBLIC_INTERFACE
 * ingestMetric
 * Ingest a metric data point.
 */
function ingestMetric(payload, principal, req) {
  /** Accepts a metric object and stores it into metric buffer. */
  const point = {
    '@timestamp': payload.timestamp,
    name: payload.name,
    value: payload.value,
    labels: payload.labels || {},
    receivedAt: new Date().toISOString(),
  };
  metrics.push(point);
  writeAudit({
    actor: principal?.subject || 'unknown',
    action: 'metric.ingest',
    resource: point.name,
    details: { value: point.value, ip: req.ip },
  });
  return point;
}

module.exports = {
  ingestLog,
  ingestMetric,
};
