'use strict';

const { getDashboardData } = require('../services/dashboard');

class DashboardController {
  /**
   * PUBLIC_INTERFACE
   * getDashboard
   * Return dashboard widgets payload.
   */
  getDashboard(_req, res) {
    /** Returns dashboard JSON */
    return res.status(200).json(getDashboardData());
  }
}

module.exports = new DashboardController();
