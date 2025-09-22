'use strict';

const alertsService = require('../services/alerts');

class AlertsController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** List alerts, optionally filtered by status. */
    try {
      const { status } = req.query || {};
      const result = alertsService.listAlerts({ status });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Create a manual alert (for testing). */
    try {
      const alert = req.body || {};
      if (!alert.id) {
        alert.id = `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      }
      if (!alert.createdAt) {
        alert.createdAt = new Date().toISOString();
      }
      const entry = {
        ...alert,
        correlationId: req.correlationId || alert.correlationId || '',
      };
      const storage = require('../services/storage');
      await storage.addAlert(entry);
      return res.status(201).json({ status: 'created', alert: entry });
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ code: 'INVALID_INPUT', message: err.message });
      }
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async listRules(req, res, next) {
    /** List alert rules. */
    try {
      const result = alertsService.listAlertRules();
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async upsertRule(req, res, next) {
    /** Create or update an alert rule. */
    try {
      const rule = alertsService.upsertAlertRule(req.body || {});
      return res.status(201).json({ status: 'ok', rule });
    } catch (err) {
      if (err.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ code: 'INVALID_INPUT', message: err.message });
      }
      return next(err);
    }
  }
}

module.exports = new AlertsController();
