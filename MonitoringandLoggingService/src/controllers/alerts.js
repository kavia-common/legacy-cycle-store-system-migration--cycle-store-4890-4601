'use strict';

const { validateAlert, validateAlertRule } = require('../middleware/validators');
const { listAlerts, createAlert, listAlertRules, upsertAlertRule } = require('../services/alerts');

class AlertsController {
  /**
   * PUBLIC_INTERFACE
   * getAlerts
   * List alerts with optional status filter and pagination.
   */
  getAlerts(req, res) {
    /** Returns alerts */
    const { status, page = 1, pageSize = 20 } = req.query;
    const parsed = {
      status: status,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 20,
    };
    const result = listAlerts(parsed);
    return res.status(200).json(result);
  }

  /**
   * PUBLIC_INTERFACE
   * postAlert
   * Manually create an alert (admin/operator).
   */
  postAlert(req, res) {
    /** Creates alert */
    const errors = validateAlert(req.body || {});
    if (errors.length) return res.status(400).json({ code: 'bad_request', message: 'Invalid alert', details: errors.join(', ') });
    const saved = createAlert(req.body, req.principal);
    return res.status(201).json(saved);
  }

  /**
   * PUBLIC_INTERFACE
   * getRules
   * List alert rules.
   */
  getRules(_req, res) {
    /** Lists alert rules */
    return res.status(200).json(listAlertRules());
  }

  /**
   * PUBLIC_INTERFACE
   * upsertRule
   * Create or update an alert rule.
   */
  upsertRule(req, res) {
    /** Upserts an alert rule */
    const errors = validateAlertRule(req.body || {});
    if (errors.length) return res.status(400).json({ code: 'bad_request', message: 'Invalid alert rule', details: errors.join(', ') });
    const saved = upsertAlertRule(req.body, req.principal);
    return res.status(201).json(saved);
  }
}

module.exports = new AlertsController();
