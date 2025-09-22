'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * A simple storage module that persists logs/metrics to memory and optionally to files (JSON lines).
 * This is a placeholder persistence layer with a documented integration point for ELK/Prometheus.
 */
class Storage {
  constructor() {
    this.logs = [];     // {timestamp, level, message, source, context, correlationId}
    this.metrics = [];  // {timestamp, name, value, labels}
    this.alerts = [];   // {id, status, message, createdAt, severity, correlationId, ruleId?}
    this.alertRules = []; // {id, name, expression, enabled, severity}

    if (config.persistToFile) {
      this.ensureDataDir();
      this.logsFile = path.join(config.dataDir, 'logs.jsonl');
      this.metricsFile = path.join(config.dataDir, 'metrics.jsonl');
      this.alertsFile = path.join(config.dataDir, 'alerts.jsonl');
      this.appendQueue = Promise.resolve();
    }
  }

  ensureDataDir() {
    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }
  }

  appendToFile(filePath, record) {
    if (!config.persistToFile) return Promise.resolve();
    const line = JSON.stringify(record) + '\n';
    // serialize appends to avoid concurrent file handle issues
    this.appendQueue = this.appendQueue.then(
      () =>
        new Promise((resolve, reject) => {
          fs.appendFile(filePath, line, (err) => (err ? reject(err) : resolve()));
        })
    );
    return this.appendQueue;
  }

  // PUBLIC_INTERFACE
  addLog(entry) {
    /** Persist a log entry to memory and optionally to file. */
    this.logs.push(entry);
    // keep memory bounded
    if (this.logs.length > 10000) this.logs.shift();
    return this.appendToFile(this.logsFile, entry);
  }

  // PUBLIC_INTERFACE
  addMetric(entry) {
    /** Persist a metric entry to memory and optionally to file. */
    this.metrics.push(entry);
    if (this.metrics.length > 10000) this.metrics.shift();
    return this.appendToFile(this.metricsFile, entry);
  }

  // PUBLIC_INTERFACE
  addAlert(entry) {
    /** Persist an alert entry to memory and optionally to file. */
    this.alerts.push(entry);
    if (this.alerts.length > 5000) this.alerts.shift();
    return this.appendToFile(this.alertsFile, entry);
  }

  // PUBLIC_INTERFACE
  upsertAlertRule(rule) {
    /** Create or update an alert rule. */
    const idx = this.alertRules.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      this.alertRules[idx] = { ...this.alertRules[idx], ...rule };
    } else {
      this.alertRules.push(rule);
    }
    return rule;
  }

  // PUBLIC_INTERFACE
  listLogs() {
    /** Return current in-memory logs. In real deployment, query Elasticsearch instead. */
    return this.logs;
  }

  // PUBLIC_INTERFACE
  listMetrics() {
    /** Return current in-memory metrics. In real deployment, export to Prometheus or TSDB. */
    return this.metrics;
  }

  // PUBLIC_INTERFACE
  listAlerts({ status } = {}) {
    /** List current alerts with optional status filter. */
    let items = this.alerts.slice();
    if (status) {
      items = items.filter((a) => a.status === status);
    }
    return items;
  }

  // PUBLIC_INTERFACE
  listAlertRules() {
    /** List configured alert rules. */
    return this.alertRules.slice();
  }
}

module.exports = new Storage();
