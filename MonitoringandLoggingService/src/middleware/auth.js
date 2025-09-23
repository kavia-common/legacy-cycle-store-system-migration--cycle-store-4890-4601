'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Extract roles from JWT claims. Supports 'roles' or 'scope' (space-separated).
 */
function extractRoles(claims) {
  if (!claims) return [];
  if (Array.isArray(claims.roles)) return claims.roles;
  if (typeof claims.scope === 'string') return claims.scope.split(' ').filter(Boolean);
  return [];
}

/**
 * PUBLIC_INTERFACE
 * authMiddleware
 * Secures routes using:
 *  - Bearer JWT with RS256 (preferred)
 *  - or X-API-Key header for ingestion paths (if configured)
 */
function authMiddleware(required = true) {
  /** Secures route; sets req.user { sub, roles } when available. */
  return (req, res, next) => {
    try {
      const apiKey = req.header('X-API-Key');
      if (apiKey && config.ingestApiKeys.includes(apiKey)) {
        req.user = { sub: 'api-key', roles: ['ingest'] };
        return next();
      }

      const auth = req.header('Authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.substring(7) : null;
      if (!token) {
        if (required) return res.status(401).json({ error: 'unauthorized', message: 'Missing token or API key' });
        return next();
      }

      const decoded = jwt.verify(token, config.jwtPublicKey, { algorithms: [config.jwtAlgorithm] });
      req.user = {
        sub: decoded.sub || decoded.user || 'unknown',
        roles: extractRoles(decoded)
      };
      return next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ error: 'unauthorized', message: err.message });
      }
      return next();
    }
  };
}

/**
 * PUBLIC_INTERFACE
 * requireRoles
 * Enforces at least one of the allowed roles.
 */
function requireRoles(allowed) {
  /** Returns 403 if current principal hasn't any allowed role. */
  return (req, res, next) => {
    const roles = (req.user && req.user.roles) || [];
    if (allowed.some(r => roles.includes(r))) return next();
    return res.status(403).json({ error: 'forbidden', message: 'Insufficient role' });
  };
}

module.exports = {
  authMiddleware,
  requireRoles
};
