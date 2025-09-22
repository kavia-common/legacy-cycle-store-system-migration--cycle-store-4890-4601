'use strict';

const crypto = require('crypto');
const config = require('../config');

/**
 * Generate a RFC4122 v4-like ID using crypto.randomUUID if available,
 * otherwise fallback to a time-based unique-ish identifier.
 */
function generateId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `corr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// PUBLIC_INTERFACE
function correlationIdMiddleware(req, res, next) {
  /** Correlation ID middleware.
   * Ensures a correlation ID exists on incoming requests, adds it to response headers,
   * and exposes it via req.correlationId and res.locals.correlationId.
   */
  try {
    const headerName = config.correlationHeader;
    let cid = (req.headers[headerName] || req.headers[headerName.toUpperCase()]) || '';
    if (!cid || typeof cid !== 'string' || !cid.trim()) {
      cid = generateId();
    }
    req.correlationId = cid;
    res.locals.correlationId = cid;
    res.setHeader(headerName, cid);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  correlationIdMiddleware,
  generateId,
};
