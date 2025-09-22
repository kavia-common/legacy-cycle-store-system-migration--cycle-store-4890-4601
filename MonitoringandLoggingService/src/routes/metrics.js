'use strict';

const express = require('express');
const controller = require('../controllers/metrics');

const router = express.Router();

/**
 * @swagger
 * /metrics:
 *   post:
 *     summary: Report a metric entry
 *     description: Accepts a metric and evaluates alert rules. Placeholder for Prometheus/TSDB integration.
 *     tags: [Metrics]
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
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: List recent metrics (demo)
 *     description: Returns in-memory metrics (limited). Use Prometheus/Grafana for real-time graphs.
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: List of metrics
 */
router.get('/', controller.list.bind(controller));

module.exports = router;
