'use strict';

const alertsService = require('../services/alertService');

function getAlerts(req, res) {
  const { status, page = '1', pageSize = '20' } = req.query;
  const out = alertsService.listAlerts({ status, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) });
  return res.json(out);
}

function postAlert(req, res) {
  const created = alertsService.createAlert(req.body, req.user?.sub);
  return res.status(201).json(created);
}

function patchAlertResolve(req, res) {
  const updated = alertsService.resolveAlert(req.params.id, req.user?.sub);
  if (!updated) return res.status(404).json({ error: 'not_found', message: 'Alert not found' });
  return res.json(updated);
}

module.exports = { getAlerts, postAlert, patchAlertResolve };
