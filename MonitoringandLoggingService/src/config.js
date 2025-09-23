'use strict';

/**
 * Centralized configuration loader using environment variables.
 * IMPORTANT: Do not commit actual secrets. Provide .env.example separately.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
  // RBAC roles: admin, analyst, viewer, ingest
  jwtPublicKey: process.env.JWT_PUBLIC_KEY || '', // PEM public key for verifying JWT (RS256)
  jwtAlgorithm: process.env.JWT_ALG || 'RS256',
  // Optional static API keys for ingestion (for agents without JWT)
  ingestApiKeys: (process.env.INGEST_API_KEYS || '').split(',').map(s => s.trim()).filter(Boolean),

  // External SIEM / ELK endpoints (simulated as HTTP endpoints)
  elk: {
    enabled: (process.env.ELK_ENABLED || 'false').toLowerCase() === 'true',
    logstashHttpUrl: process.env.LOGSTASH_HTTP_URL || '', // e.g., http://logstash:8080/_bulk
    elasticUrl: process.env.ELASTIC_URL || '', // e.g., http://elasticsearch:9200
    indexPrefix: process.env.ELK_INDEX_PREFIX || 'mls',
  },

  // Data retention and pagination defaults
  retentionDays: parseInt(process.env.RETENTION_DAYS || '30', 10),
  defaultPageSize: parseInt(process.env.PAGE_SIZE || '20', 10),

  // Compliance
  complianceOfficerEmail: process.env.COMPLIANCE_OFFICER_EMAIL || '',

  // Toggle request logging
  requestLogging: (process.env.REQUEST_LOGGING || 'true').toLowerCase() === 'true'
};

module.exports = config;
