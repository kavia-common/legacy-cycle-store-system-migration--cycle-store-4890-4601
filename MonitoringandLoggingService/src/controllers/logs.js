'use strict';

const logsService = require('../services/logs');

class LogsController {
  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Ingest a log entry. Returns 201 on success. */
    try {
      const result = await logsService.ingestLog(req.body || {}, req.correlationId);
      return res.status(201).json({ status: 'created', log: result });
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ code: 'INVALID_INPUT', message: err.message });
      }
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List recent in-memory logs (dev/demo). */
    try {
      const result = logsService.listLogs();
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new LogsController();
