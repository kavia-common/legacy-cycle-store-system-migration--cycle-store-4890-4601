'use strict';

/**
 * In-memory store for logs, metrics, alerts, and rules.
 * This is a stand-in for Elasticsearch/ClickHouse/TSDB. Replace with adapters later.
 */

class CircularBuffer {
  constructor(max = 10000) {
    this.max = max;
    this.arr = [];
  }
  push(item) {
    if (this.arr.length >= this.max) this.arr.shift();
    this.arr.push(item);
  }
  all() {
    return this.arr.slice();
  }
}

const logs = new CircularBuffer(Number(process.env.BUFFER_LOGS_MAX || 20000));
const metrics = new CircularBuffer(Number(process.env.BUFFER_METRICS_MAX || 20000));
const alerts = new CircularBuffer(Number(process.env.BUFFER_ALERTS_MAX || 2000));
const alertRules = new Map(); // id -> rule
const audits = new CircularBuffer(Number(process.env.BUFFER_AUDIT_MAX || 5000));

module.exports = {
  logs,
  metrics,
  alerts,
  alertRules,
  audits,
};
