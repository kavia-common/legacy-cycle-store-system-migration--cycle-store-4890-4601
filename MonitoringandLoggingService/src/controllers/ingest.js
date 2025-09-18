'use strict';

const { validateLogEntry, validateMetricEntry } = require('../middleware/validators');
const { ingestLog, ingestMetric } = require('../services/ingest');

class IngestController {
  /**
   * PUBLIC_INTERFACE
   * postLog
   * Ingest a log entry.
   */
  postLog(req, res) {
    /** Accepts a LogEntry and stores it. */
    const errors = validateLogEntry(req.body || {});
    if (errors.length) return res.status(400).json({ code: 'bad_request', message: 'Invalid log entry', details: errors.join(', ') });
    const saved = ingestLog(req.body, req.principal, req);
    return res.status(201).json(saved);
  }

  /**
   * PUBLIC_INTERFACE
   * postMetric
   * Ingest a metric entry.
   */
  postMetric(req, res) {
    /** Accepts a MetricEntry and stores it. */
    const errors = validateMetricEntry(req.body || {});
    if (errors.length) return res.status(400).json({ code: 'bad_request', message: 'Invalid metric entry', details: errors.join(', ') });
    const saved = ingestMetric(req.body, req.principal, req);
    return res.status(201).json(saved);
  }
}

module.exports = new IngestController();
