'use strict';

/**
 * Centralized configuration loader for the Monitoring and Logging Service.
 * Values are read from environment variables with sensible defaults.
 */
require('dotenv').config();

const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  // Persistence config
  persistToFile: (process.env.PERSIST_TO_FILE || 'false').toLowerCase() === 'true',
  dataDir: process.env.DATA_DIR || path.join(process.cwd(), 'data'),

  // External integrations (placeholders / doc only)
  elasticUrl: process.env.ELASTIC_URL || '',
  prometheusPushgatewayUrl: process.env.PROMETHEUS_PUSHGATEWAY_URL || '',

  // Notification service integration
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || '',
  notificationServiceToken: process.env.NOTIFICATION_SERVICE_TOKEN || '',

  // Service identity
  serviceName: process.env.SERVICE_NAME || 'MonitoringandLoggingService',

  // Correlation ID
  correlationHeader: (process.env.CORRELATION_ID_HEADER || 'x-correlation-id').toLowerCase(),
};

module.exports = config;
