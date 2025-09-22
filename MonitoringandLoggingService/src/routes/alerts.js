'use strict';

const express = require('express');
const controller = require('../controllers/alerts');

const router = express.Router();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: List alerts
 *     description: Returns active/resolved alerts.
 *     tags: [Alerts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESOLVED]
 *     responses:
 *       200:
 *         description: List of alerts
 */
router.get('/', controller.list.bind(controller));

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create an alert (manual)
 *     description: Creates an alert entry manually. Normally alerts are generated from rules.
 *     tags: [Alerts]
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
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /alerts/rules:
 *   get:
 *     summary: List alert rules
 *     tags: [Alerts]
 *     responses:
 *       200:
 *         description: List of alert rules
 */
router.get('/rules', controller.listRules.bind(controller));

/**
 * @swagger
 * /alerts/rules:
 *   post:
 *     summary: Create or update an alert rule
 *     description: Expression format "<metricName> <op> <threshold>", ops: > >= < <= == !=
 *     tags: [Alerts]
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
 */
router.post('/rules', controller.upsertRule.bind(controller));

module.exports = router;
