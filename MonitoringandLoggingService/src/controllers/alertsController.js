'use strict';

const alertService = require('../services/alertService');

/**
 * PUBLIC_INTERFACE
 * list
 */
async function list(req, res) {
  const { status, page = 1, pageSize = 20 } = req.query;
  const alerts = alertService.listAlerts({ status, page: Number(page), pageSize: Number(pageSize) });
  return res.status(200).json(alerts);
}

/**
 * PUBLIC_INTERFACE
 * create
 */
async function create(req, res) {
  const alert = await alertService.createAlert(req.body, req.user?.sub);
  return res.status(201).json(alert);
}

/**
 * PUBLIC_INTERFACE
 * resolve
 */
async function resolve(req, res) {
  const alert = await alertService.resolveAlert(req.params.id, req.user?.sub);
  if (!alert) return res.status(404).json({ error: 'not_found', message: 'Alert not found' });
  return res.status(200).json(alert);
}

module.exports = { list, create, resolve };
