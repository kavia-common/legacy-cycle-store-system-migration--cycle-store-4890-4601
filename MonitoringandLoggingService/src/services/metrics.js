'use strict';

const storage = require('./storage');
const alerts = require('./alerts');

// PUBLIC_INTERFACE
async function ingestMetric({ timestamp, name, value, labels }, correlationId) {
  /** Validate, persist, and evaluate a metric. */
  if (!timestamp || !name || typeof value !== 'number') {
    const err = new Error('timestamp, name, value are required (value must be number)');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const entry = {
    timestamp,
    name,
    value,
    labels: labels || {},
    correlationId: correlationId || '',
  };
  await storage.addMetric(entry);
  await alerts.evaluateMetricAgainstRules(entry, correlationId);
  return entry;
}

// PUBLIC_INTERFACE
function listMetrics() {
  /** Return in-memory metrics (placeholder for Prometheus integration). */
  return storage.listMetrics();
}

module.exports = {
  ingestMetric,
  listMetrics,
};
