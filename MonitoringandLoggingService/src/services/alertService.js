'use strict';

const { alerts, addAudit } = require('../models/store');
const { v4: uuidv4 } = require('uuid');

/**
 * PUBLIC_INTERFACE
 * listAlerts
 */
function listAlerts({ status, page = 1, pageSize = 20 }) {
  const start = (page - 1) * pageSize;
  const filtered = status ? alerts.filter(a => a.status === status) : alerts;
  return {
    total: filtered.length,
    page, pageSize,
    data: filtered.slice(start, start + pageSize)
  };
}

/**
 * PUBLIC_INTERFACE
 * createAlert
 */
function createAlert(payload, principal = 'unknown') {
  const alert = {
    id: payload.id || uuidv4(),
    status: payload.status || 'ACTIVE',
    message: payload.message || '',
    createdAt: payload.createdAt || new Date().toISOString(),
    severity: payload.severity || 'MEDIUM',
    source: payload.source || 'system'
  };
  alerts.push(alert);
  addAudit({ type: 'alert_create', performedBy: principal, details: { id: alert.id, severity: alert.severity } });
  return alert;
}

/**
 * PUBLIC_INTERFACE
 * resolveAlert
 */
function resolveAlert(id, principal = 'unknown') {
  const found = alerts.find(a => a.id === id);
  if (!found) return null;
  found.status = 'RESOLVED';
  addAudit({ type: 'alert_resolve', performedBy: principal, details: { id } });
  return found;
}

module.exports = {
  listAlerts,
  createAlert,
  resolveAlert
};
