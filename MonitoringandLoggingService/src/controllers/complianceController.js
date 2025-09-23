'use strict';

const complianceService = require('../services/complianceService');

function getAuditReport(req, res) {
  const { from, to } = req.query;
  const report = complianceService.getAuditReport({ from, to });
  return res.json(report);
}

module.exports = { getAuditReport };
