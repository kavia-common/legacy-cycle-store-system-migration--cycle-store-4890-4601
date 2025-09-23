'use strict';

const { logs, metrics, alerts } = require('../models/store');

/**
 * PUBLIC_INTERFACE
 * getDashboard
 * Returns basic aggregations for ops dashboard
 */
function getDashboard() {
  const now = Date.now();
  const lastHour = new Date(now - 60 * 60 * 1000).toISOString();
  const errorsLastHour = logs.filter(l => l.level === 'ERROR' && l.timestamp >= lastHour).length;
  const metricsLastHour = metrics.filter(m => m.timestamp >= lastHour);

  // Group metrics by name
  const metricGroups = metricsLastHour.reduce((acc, m) => {
    acc[m.name] = acc[m.name] || { count: 0, min: m.value, max: m.value, sum: 0 };
    const g = acc[m.name];
    g.count += 1;
    g.min = Math.min(g.min, m.value);
    g.max = Math.max(g.max, m.value);
    g.sum += m.value;
    return acc;
  }, {});

  const metricSummary = Object.entries(metricGroups).map(([name, g]) => ({
    name,
    count: g.count,
    min: g.min,
    max: g.max,
    avg: g.sum / g.count
  }));

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

  return {
    widgets: [
      { type: 'kpi', title: 'Errors (last hour)', value: errorsLastHour },
      { type: 'kpi', title: 'Active Alerts', value: activeAlerts },
      { type: 'table', title: 'Metric Summary (last hour)', rows: metricSummary }
    ]
  };
}

module.exports = { getDashboard };
