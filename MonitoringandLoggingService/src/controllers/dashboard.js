'use strict';

const storage = require('../services/storage');

class DashboardController {
  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Return sample dashboard data suitable for widgets. */
    try {
      const now = Date.now();
      const logs = storage.listLogs();
      const metrics = storage.listMetrics();
      const alerts = storage.listAlerts({ status: 'ACTIVE' });

      const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
      const logsByLevel = levels.map((lvl) => ({
        level: lvl,
        count: logs.filter((l) => l.level === lvl && now - new Date(l.timestamp).getTime() <= 15 * 60 * 1000).length,
      }));

      // Latest metric values by name
      const latestByName = {};
      for (let i = metrics.length - 1; i >= 0; i--) {
        const m = metrics[i];
        if (!latestByName[m.name]) {
          latestByName[m.name] = m.value;
        }
      }
      const latestMetrics = Object.entries(latestByName).map(([name, value]) => ({ name, value }));

      // Simple timeseries sample (last 10 points)
      const tsNames = Object.keys(latestByName).slice(0, 3);
      const timeseries = tsNames.map((name) => ({
        name,
        points: metrics.filter((m) => m.name === name).slice(-10).map((m) => ({ t: m.timestamp, v: m.value })),
      }));

      const data = {
        widgets: [
          {
            id: 'w-logs-levels',
            type: 'bar',
            title: 'Logs by Level (last 15m)',
            data: logsByLevel,
          },
          {
            id: 'w-latest-metrics',
            type: 'kv',
            title: 'Latest Metric Values',
            data: latestMetrics,
          },
          {
            id: 'w-timeseries',
            type: 'timeseries',
            title: 'Key Metrics (last N)',
            data: timeseries,
          },
          {
            id: 'w-alerts',
            type: 'stat',
            title: 'Active Alerts',
            data: { count: alerts.length },
          },
        ],
        generatedAt: new Date().toISOString(),
      };

      return res.status(200).json(data);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DashboardController();
