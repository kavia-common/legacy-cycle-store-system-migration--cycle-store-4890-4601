class HealthService {
  // PUBLIC_INTERFACE
  getStatus() {
    /** Returns a dictionary representing health status. */
    return {
      status: 'ok',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}

module.exports = new HealthService();
