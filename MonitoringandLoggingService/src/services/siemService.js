'use strict';

const axios = require('axios').default;
const config = require('../config');

// Translate log/metric to bulk index line if needed
function toBulkAction(index, doc) {
  return `{ "index": { "_index": "${index}" } }\n${JSON.stringify(doc)}\n`;
}

/**
 * PUBLIC_INTERFACE
 * forwardLog
 * Sends log to configured external ELK/Logstash endpoint (if enabled)
 */
async function forwardLog(log) {
  if (!config.elk.enabled) return;
  try {
    if (config.elk.logstashHttpUrl) {
      // send as JSON - many logstash HTTP inputs accept raw JSON lines
      await axios.post(config.elk.logstashHttpUrl, log, { timeout: 2000 });
      return;
    }
    if (config.elk.elasticUrl) {
      const index = `${config.elk.indexPrefix}-logs-${new Date(log.timestamp).toISOString().slice(0, 10)}`;
      const bulk = toBulkAction(index, log);
      await axios.post(`${config.elk.elasticUrl}/_bulk`, bulk, {
        headers: { 'Content-Type': 'application/x-ndjson' },
        timeout: 2000
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed forwarding log to SIEM:', e.message);
  }
}

/**
 * PUBLIC_INTERFACE
 * forwardMetric
 * Sends metric to external ELK/Logstash endpoint (if enabled)
 */
async function forwardMetric(metric) {
  if (!config.elk.enabled) return;
  try {
    if (config.elk.logstashHttpUrl) {
      await axios.post(config.elk.logstashHttpUrl, metric, { timeout: 2000 });
      return;
    }
    if (config.elk.elasticUrl) {
      const index = `${config.elk.indexPrefix}-metrics-${new Date(metric.timestamp).toISOString().slice(0, 10)}`;
      const bulk = toBulkAction(index, metric);
      await axios.post(`${config.elk.elasticUrl}/_bulk`, bulk, {
        headers: { 'Content-Type': 'application/x-ndjson' },
        timeout: 2000
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed forwarding metric to SIEM:', e.message);
  }
}

module.exports = { forwardLog, forwardMetric };
