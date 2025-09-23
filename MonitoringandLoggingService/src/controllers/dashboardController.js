'use strict';

const dashboardService = require('../services/dashboardService');

function getDashboard(_req, res) {
  return res.json(dashboardService.getDashboard());
}

module.exports = { getDashboard };
