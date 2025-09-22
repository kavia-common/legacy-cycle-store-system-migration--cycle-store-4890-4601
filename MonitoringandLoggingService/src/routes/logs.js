'use strict';

const express = require('express');
const controller = require('../controllers/logs');

const router = express.Router();

/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Ingest a log entry
 *     description: Accepts a log entry and stores it with correlation ID propagation. Placeholder for ELK integration.
 *     tags: [Logs]
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
 */
router.post('/', controller.create.bind(controller));

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: List recent logs (demo)
 *     description: Returns in-memory logs (limited). In production, query Elasticsearch or a log store.
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: List of logs
 */
router.get('/', controller.list.bind(controller));

module.exports = router;
