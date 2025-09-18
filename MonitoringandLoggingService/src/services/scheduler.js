'use strict';

const { evaluateRules } = require('./alerts');
const { logs, metrics } = require('./store');

let timer = null;

/**
 * PUBLIC_INTERFACE
 * startRuleEvaluator
 * Starts a simple interval that evaluates alert rules against recent data.
 */
function startRuleEvaluator() {
  /** Begin periodic rule evaluation. */
  const intervalMs = Number(process.env.RULE_EVAL_INTERVAL_MS || 10000);
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    try {
      const recentLogs = logs.all().slice(-500);
      const recentMetrics = metrics.all().slice(-500);
      evaluateRules(recentMetrics, recentLogs);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Rule evaluation error:', e.message);
    }
  }, intervalMs);
}

/**
 * PUBLIC_INTERFACE
 * stopRuleEvaluator
 * Stops the evaluation loop.
 */
function stopRuleEvaluator() {
  /** Stop periodic evaluation */
  if (timer) clearInterval(timer);
  timer = null;
}

module.exports = {
  startRuleEvaluator,
  stopRuleEvaluator,
};
