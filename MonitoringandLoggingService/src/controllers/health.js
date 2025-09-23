const healthService = require('../services/health');

class HealthController {
  // PUBLIC_INTERFACE
  check(req, res) {
    /** Health check endpoint. Returns current status, environment and timestamp. */
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();
