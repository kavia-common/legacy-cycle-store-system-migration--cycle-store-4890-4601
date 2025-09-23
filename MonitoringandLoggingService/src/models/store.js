'use strict';

/**
 * Simple in-memory stores for demo/reference implementation.
 * In production, replace with Elasticsearch or a database.
 */

const logs = [];       // {timestamp, level, message, source, context, receivedAt}
const metrics = [];    // {timestamp, name, value, labels, receivedAt}
const alerts = [];     // {id, status, message, createdAt, severity, source?}
const alertRules = []; // {id, name, expression, enabled, severity, createdAt, updatedAt}
const audits = [];     // Audit events for compliance

function addAudit(event) {
  audits.push({ ...event, at: new Date().toISOString() });
}

module.exports = {
  logs,
  metrics,
  alerts,
  alertRules,
  audits,
  addAudit
};
