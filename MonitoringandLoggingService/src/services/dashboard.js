'use strict';

const { logs, metrics, alerts } = require('./store');

/**
 * PUBLIC_INTERFACE
 * getDashboardData
 * Aggregate key widgets for operations overview.
 */
function getDashboardData() {
  /** Produces a small set of widgets: counts, error trends, top sources, metric summary. */
  const allLogs = logs.all();
  const allMetrics = metrics.all();
  const allAlerts = alerts.all();

  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;

  const recentErrors = allLogs.filter(l => l.level === 'ERROR' && new Date(l['@timestamp']).getTime() >= fiveMinAgo);
  const bySource = {};
  for (const l of recentErrors) {
    bySource[l.source] = (bySource[l.source] || 0) + 1;
  }
  const topSources = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));

  const latestMetrics = {};
  for (const m of allMetrics) {
    latestMetrics[m.name] = m;
  }

  return {
    widgets: [
      { type: 'kpi', title: 'Logs (5m)', value: allLogs.filter(l => new Date(l['@timestamp']).getTime() >= fiveMinAgo).length },
      { type: 'kpi', title: 'Errors (5m)', value: recentErrors.length },
      { type: 'kpi', title: 'Active Alerts', value: allAlerts.filter(a => a.status === 'ACTIVE').length },
      { type: 'list', title: 'Top Error Sources (5m)', items: topSources },
      { type: 'metrics-latest', title: 'Latest Metrics Snapshot', items: Object.values(latestMetrics).slice(-20) },
    ],
  };
}

module.exports = {
  getDashboardData,
};
