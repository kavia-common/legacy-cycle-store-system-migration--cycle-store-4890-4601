'use strict';

const express = require('express');
const { authMiddleware, requireRoles } = require('../middleware/auth');
const ingestController = require('../controllers/ingestController');
const alertsController = require('../controllers/alertsController');
const rulesController = require('../controllers/alertRulesController');
const dashboardController = require('../controllers/dashboardController');
const complianceController = require('../controllers/complianceController');

const router = express.Router();

// Ingestion endpoints (ingest role or admin)
router.post('/logs', authMiddleware(true), requireRoles(['ingest', 'admin']), ingestController.postLog);
router.post('/metrics', authMiddleware(true), requireRoles(['ingest', 'admin']), ingestController.postMetric);

// Alerts
router.get('/alerts', authMiddleware(true), requireRoles(['analyst', 'admin', 'viewer']), alertsController.getAlerts);
router.post('/alerts', authMiddleware(true), requireRoles(['analyst', 'admin']), alertsController.postAlert);
router.patch('/alerts/:id/resolve', authMiddleware(true), requireRoles(['analyst', 'admin']), alertsController.patchAlertResolve);

// Alert rules (CRUD)
router.get('/alerts/rules', authMiddleware(true), requireRoles(['analyst', 'admin']), rulesController.getRules);
router.post('/alerts/rules', authMiddleware(true), requireRoles(['analyst', 'admin']), rulesController.postRule);
router.delete('/alerts/rules/:id', authMiddleware(true), requireRoles(['admin']), rulesController.deleteRule);

// Dashboard
router.get('/dashboard', authMiddleware(true), requireRoles(['viewer', 'analyst', 'admin']), dashboardController.getDashboard);

// Compliance & audit reporting
router.get('/compliance/audit', authMiddleware(true), requireRoles(['analyst', 'admin']), complianceController.getAuditReport);

module.exports = router;
