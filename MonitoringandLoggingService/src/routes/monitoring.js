'use strict';

const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ingestController = require('../controllers/ingest');
const alertsController = require('../controllers/alerts');
const dashboardController = require('../controllers/dashboard');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Ingestion
 *     description: Log and metric ingestion
 *   - name: Alerts
 *     description: Alert listing and rule management
 *   - name: Dashboard
 *     description: Dashboard data aggregation
 */

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Ingest a log entry
 *     tags: [Ingestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogEntry'
 *     responses:
 *       201:
 *         description: Log entry created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/logs', requireRole('operator'), (req, res) => ingestController.postLog(req, res));

/**
 * @swagger
 * /metrics:
 *   post:
 *     summary: Report a metric entry
 *     tags: [Ingestion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetricEntry'
 *     responses:
 *       201:
 *         description: Metric entry created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/metrics', requireRole('operator'), (req, res) => ingestController.postMetric(req, res));

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: List alerts
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESOLVED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: List of alerts
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       201:
 *         description: Alert created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get('/alerts', requireRole('analyst'), (req, res) => alertsController.getAlerts(req, res));
router.post('/alerts', requireRole('operator'), (req, res) => alertsController.postAlert(req, res));

/**
 * @swagger
 * /alerts/rules:
 *   get:
 *     summary: List alert rules
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of alert rules
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create or update an alert rule
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlertRule'
 *     responses:
 *       201:
 *         description: Alert rule created/updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.get('/alerts/rules', requireRole('analyst'), (req, res) => alertsController.getRules(req, res));
router.post('/alerts/rules', requireRole('admin'), (req, res) => alertsController.upsertRule(req, res));

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retrieve dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', requireRole('analyst'), (req, res) => dashboardController.getDashboard(req, res));

module.exports = router;
