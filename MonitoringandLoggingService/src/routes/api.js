const express = require('express');
const router = express.Router();
const ingestController = require('../controllers/ingestController');
const alerts = require('../controllers/alertsController');

// PUBLIC_INTERFACE
router.post('/logs', ingestController.ingestLog);

// PUBLIC_INTERFACE
router.get('/alerts', alerts.list);
// PUBLIC_INTERFACE
router.post('/alerts', alerts.create);
// PUBLIC_INTERFACE
router.get('/alerts/rules', alerts.listRules);
// PUBLIC_INTERFACE
router.post('/alerts/rules', alerts.upsertRule);

module.exports = router;
