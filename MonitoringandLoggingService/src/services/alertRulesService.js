'use strict';

const { alertRules, addAudit } = require('../models/store');
const { v4: uuidv4 } = require('uuid');

/**
 * PUBLIC_INTERFACE
 * listRules
 */
function listRules() {
  return alertRules.slice();
}

/**
 * PUBLIC_INTERFACE
 * upsertRule
 */
function upsertRule(rule, principal = 'unknown') {
  const now = new Date().toISOString();
  let existing = null;
  if (rule.id) {
    existing = alertRules.find(r => r.id === rule.id);
  }
  if (existing) {
    existing.name = rule.name ?? existing.name;
    existing.expression = rule.expression ?? existing.expression;
    existing.enabled = typeof rule.enabled === 'boolean' ? rule.enabled : existing.enabled;
    existing.severity = rule.severity ?? existing.severity;
    existing.updatedAt = now;
    addAudit({ type: 'alert_rule_update', performedBy: principal, details: { id: existing.id } });
    return existing;
  }
  const created = {
    id: uuidv4(),
    name: rule.name || 'unnamed',
    expression: rule.expression || '',
    enabled: typeof rule.enabled === 'boolean' ? rule.enabled : true,
    severity: rule.severity || 'MEDIUM',
    createdAt: now,
    updatedAt: now
  };
  alertRules.push(created);
  addAudit({ type: 'alert_rule_create', performedBy: principal, details: { id: created.id } });
  return created;
}

/**
 * PUBLIC_INTERFACE
 * deleteRule
 */
function deleteRule(id, principal = 'unknown') {
  const idx = alertRules.findIndex(r => r.id === id);
  if (idx === -1) return false;
  alertRules.splice(idx, 1);
  addAudit({ type: 'alert_rule_delete', performedBy: principal, details: { id } });
  return true;
}

module.exports = { listRules, upsertRule, deleteRule };
