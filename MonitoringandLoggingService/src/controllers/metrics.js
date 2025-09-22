'use strict';

const metricsService = require('../services/metrics');

class MetricsController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Ingest a metric entry. Returns 201 on success. */
    try {
      const result = await metricsService.ingestMetric(req.body || {}, req.correlationId);
      return res.status(201).json({ status: 'created', metric: result });
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ code: 'INVALID_INPUT', message: err.message });
      }
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List recent in-memory metrics (dev/demo). */
    try {
      const result = metricsService.listMetrics();
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new MetricsController();
