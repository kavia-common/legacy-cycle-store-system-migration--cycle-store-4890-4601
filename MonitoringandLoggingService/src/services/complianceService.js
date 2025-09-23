'use strict';

const { audits, logs, metrics, alerts } = require('../models/store');

/**
 * PUBLIC_INTERFACE
 * getAuditReport
 * Returns a report summarizing audit events within a window.
 */
function getAuditReport({ from, to }) {
  const start = from ? new Date(from).toISOString() : '1970-01-01T00:00:00.000Z';
  const end = to ? new Date(to).toISOString() : new Date().toISOString();

  const inRange = (ts) => ts >= start && ts <= end;

  const auditEvents = audits.filter(a => inRange(a.at));
  const logCount = logs.filter(l => inRange(l.timestamp)).length;
  const metricCount = metrics.filter(m => inRange(m.timestamp)).length;
  const alertCreates = audits.filter(a => a.type === 'alert_create' && inRange(a.at)).length;
  const alertResolves = audits.filter(a => a.type === 'alert_resolve' && inRange(a.at)).length;

  return {
    window: { from: start, to: end },
    summary: {
      auditEvents: auditEvents.length,
      logsIngested: logCount,
      metricsIngested: metricCount,
      alertsCreated: alertCreates,
      alertsResolved: alertResolves
    },
    events: auditEvents.slice(-500) // cap to avoid huge payloads
  };
}

module.exports = { getAuditReport };
