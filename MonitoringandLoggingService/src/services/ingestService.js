'use strict';

const { logs, metrics, addAudit } = require('../models/store');
const siem = require('./siemService');

/**
 * PUBLIC_INTERFACE
 * ingestLog
 * Accepts ELK-compatible log entry and stores it; forwards if configured.
 */
async function ingestLog(entry, principal = 'unknown') {
  // Normalize and basic validation
  const normalized = {
    timestamp: entry.timestamp || new Date().toISOString(),
    level: entry.level || 'INFO',
    message: entry.message || '',
    source: entry.source || 'unknown',
    context: typeof entry.context === 'object' ? entry.context : {},
    receivedAt: new Date().toISOString()
  };
  if (!normalized.message) {
    const err = new Error('message is required');
    err.code = 'VALIDATION';
    throw err;
  }
  logs.push(normalized);
  addAudit({ type: 'log_ingest', performedBy: principal, details: { source: normalized.source, level: normalized.level } });
  await siem.forwardLog(normalized);
  return normalized;
}

/**
 * PUBLIC_INTERFACE
 * ingestMetric
 * Accepts metric entry and stores it; forwards if configured.
 */
async function ingestMetric(entry, principal = 'unknown') {
  const normalized = {
    timestamp: entry.timestamp || new Date().toISOString(),
    name: entry.name,
    value: Number(entry.value),
    labels: entry.labels || {},
    receivedAt: new Date().toISOString()
  };
  if (!normalized.name || Number.isNaN(normalized.value)) {
    const err = new Error('name and numeric value are required');
    err.code = 'VALIDATION';
    throw err;
  }
  metrics.push(normalized);
  addAudit({ type: 'metric_ingest', performedBy: principal, details: { name: normalized.name } });
  await siem.forwardMetric(normalized);
  return normalized;
}

module.exports = {
  ingestLog,
  ingestMetric
};
