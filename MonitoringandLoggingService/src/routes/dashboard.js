'use strict';

const express = require('express');
const controller = require('../controllers/dashboard');

const router = express.Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retrieve dashboard data
 *     description: Returns sample dashboard widgets including logs by level, latest metrics, timeseries, and active alerts count.
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/', controller.get.bind(controller));

module.exports = router;
