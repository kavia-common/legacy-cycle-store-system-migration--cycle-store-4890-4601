'use strict';

const storage = require('./storage');
const { sendAlertNotification } = require('./notification');

/**
 * Very simple alert rule parser/evaluator:
 * - expression format: "<metricName> <op> <threshold>"
 * - supported ops: >, >=, <, <=, ==, !=
 * On metric ingestion, evaluate all enabled rules whose metric name matches left operand.
 */
function parseExpression(expr) {
  const m = String(expr || '').trim().match(/^([a-zA-Z0-9_.:-]+)\s*(>=|<=|==|!=|>|<)\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  return { metric: m[1], op: m[2], threshold: parseFloat(m[3]) };
}

function compare(val, op, threshold) {
  switch (op) {
    case '>': return val > threshold;
    case '>=': return val >= threshold;
    case '<': return val < threshold;
    case '<=': return val <= threshold;
    case '==': return val === threshold;
    case '!=': return val !== threshold;
    default: return false;
  }
}

// PUBLIC_INTERFACE
async function evaluateMetricAgainstRules(metric, correlationId) {
  /** Evaluate an incoming metric against configured alert rules; trigger alerts as needed. */
  const rules = storage.listAlertRules().filter((r) => r.enabled);
  const matched = [];

  for (const rule of rules) {
    const parsed = parseExpression(rule.expression);
    if (!parsed) continue;
    if (parsed.metric !== metric.name) continue;
    const fired = compare(metric.value, parsed.op, parsed.threshold);
    if (fired) {
      const alert = {
        id: `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        status: 'ACTIVE',
        message: `[${rule.severity}] Rule "${rule.name}" violated: ${metric.name} ${parsed.op} ${parsed.threshold} (actual ${metric.value})`,
        createdAt: new Date().toISOString(),
        severity: rule.severity,
        correlationId: correlationId || '',
        ruleId: rule.id,
      };
      await storage.addAlert(alert);
      matched.push(alert);

      // Notify for HIGH/CRITICAL
      if (rule.severity === 'HIGH' || rule.severity === 'CRITICAL') {
        sendAlertNotification({
          message: alert.message,
          severity: alert.severity,
          correlationId: alert.correlationId,
        }).catch(() => {});
      }
    }
  }
  return matched;
}

// PUBLIC_INTERFACE
function listAlerts({ status } = {}) {
  /** Proxy to storage with filter. */
  return storage.listAlerts({ status });
}

// PUBLIC_INTERFACE
function listAlertRules() {
  /** List rules. */
  return storage.listAlertRules();
}

// PUBLIC_INTERFACE
function upsertAlertRule(rule) {
  /** Create/update rule with validation. */
  if (!rule || !rule.id || !rule.name || !rule.expression || typeof rule.enabled !== 'boolean' || !rule.severity) {
    const err = new Error('Invalid alert rule: id, name, expression, enabled, severity are required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const parsed = parseExpression(rule.expression);
  if (!parsed) {
    const err = new Error('Invalid alert rule expression. Expected: "<metric> <op> <threshold>"');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  return storage.upsertAlertRule(rule);
}

module.exports = {
  evaluateMetricAgainstRules,
  listAlerts,
  listAlertRules,
  upsertAlertRule,
};
