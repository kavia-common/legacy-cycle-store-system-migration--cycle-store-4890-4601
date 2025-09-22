const express = require('express');
const healthController = require('../controllers/health');
const logsRoutes = require('./logs');
const metricsRoutes = require('./metrics');
const alertsRoutes = require('./alerts');
const dashboardRoutes = require('./dashboard');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Domain routes
router.use('/logs', logsRoutes);
router.use('/metrics', metricsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
