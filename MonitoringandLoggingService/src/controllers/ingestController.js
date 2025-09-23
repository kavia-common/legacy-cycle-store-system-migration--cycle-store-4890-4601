'use strict';

const ingestService = require('../services/ingestService');

/**
 * Ingest log entry
 */
async function postLog(req, res) {
  try {
    const out = await ingestService.ingestLog(req.body, req.user?.sub);
    return res.status(201).json({ status: 'created', data: out });
  } catch (e) {
    const status = e.code === 'VALIDATION' ? 400 : 500;
    return res.status(status).json({ error: e.code || 'internal', message: e.message });
  }
}

/**
 * Ingest metric entry
 */
async function postMetric(req, res) {
  try {
    const out = await ingestService.ingestMetric(req.body, req.user?.sub);
    return res.status(201).json({ status: 'created', data: out });
  } catch (e) {
    const status = e.code === 'VALIDATION' ? 400 : 500;
    return res.status(status).json({ error: e.code || 'internal', message: e.message });
  }
}

module.exports = { postLog, postMetric };
