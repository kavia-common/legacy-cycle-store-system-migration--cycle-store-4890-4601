'use strict';

const { alerts, alertRules } = require('./store');
const { writeAudit } = require('./audit');

/**
 * PUBLIC_INTERFACE
 * listAlerts
 * Returns filtered alerts with simple pagination.
 */
function listAlerts({ status, page = 1, pageSize = 20 }) {
  /** Fetch alerts list filtered by status. */
  const all = alerts.all();
  const filtered = status ? all.filter(a => a.status === status) : all;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: filtered.slice(start, end),
    page,
    pageSize,
    total: filtered.length,
  };
}

/**
 * PUBLIC_INTERFACE
 * createAlert
 * Adds a new alert entry.
 */
function createAlert(alert, principal) {
  /** Creates an alert entry */
  alerts.push(alert);
  writeAudit({
    actor: principal?.subject || 'unknown',
    action: 'alert.create',
    resource: alert.id,
    details: { severity: alert.severity },
  });
  return alert;
}

/**
 * PUBLIC_INTERFACE
 * listAlertRules
 * Return all alert rules.
 */
function listAlertRules() {
  /** Lists configured alert rules. */
  return Array.from(alertRules.values());
}

/**
 * PUBLIC_INTERFACE
 * upsertAlertRule
 * Create or update alert rule.
 */
function upsertAlertRule(rule, principal) {
  /** Inserts or updates an alert rule. */
  alertRules.set(rule.id, rule);
  writeAudit({
    actor: principal?.subject || 'unknown',
    action: 'alertrule.upsert',
    resource: rule.id,
    details: { enabled: rule.enabled, severity: rule.severity },
  });
  return rule;
}

/**
 * Simple rule evaluation stub.
 * Expression DSL placeholder:
 *   metric:<name> > <threshold>
 *   log.level == 'ERROR'
 * In production, replace with safe parser and data source queries.
 */
function evaluateRules(recentMetrics, recentLogs) {
  const rules = listAlertRules();
  const nowIso = new Date().toISOString();
  const fired = [];

  for (const rule of rules) {
    if (!rule.enabled) continue;

    const exp = rule.expression || '';
    let matched = false;

    if (exp.startsWith('metric:')) {
      const m = /^metric:([^>\s]+)\s*>\s*([0-9.]+)$/.exec(exp);
      if (m) {
        const name = m[1];
        const threshold = Number(m[2]);
        const points = recentMetrics.filter(p => p.name === name);
        const latest = points[points.length - 1];
        matched = latest && latest.value > threshold;
      }
    } else if (exp.startsWith('log.level')) {
      const m = /^log\.level\s*==\s*'?(DEBUG|INFO|WARN|ERROR)'?$/.exec(exp);
      if (m) {
        const level = m[1];
        matched = recentLogs.some(l => l.level === level);
      }
    }

    if (matched) {
      const alert = {
        id: `${rule.id}:${Date.now()}`,
        status: 'ACTIVE',
        message: `Rule matched: ${rule.name}`,
        createdAt: nowIso,
        severity: rule.severity,
      };
      alerts.push(alert);
      fired.push(alert);
      writeAudit({
        actor: 'rule-engine',
        action: 'alert.rule_fired',
        resource: rule.id,
        details: { severity: rule.severity },
      });
    }
  }

  return fired;
}

module.exports = {
  listAlerts,
  createAlert,
  listAlertRules,
  upsertAlertRule,
  evaluateRules,
};
