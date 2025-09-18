'use strict';

/**
 * Simple JWT bearer and API key auth + RBAC middleware.
 * Reads config from env and decodes JWT (if present) in a safe, dependency-free way for demo purposes.
 * For production, use a robust JWT lib (e.g., jsonwebtoken) and JWKS verification.
 */

const rolesHierarchy = ['viewer', 'analyst', 'operator', 'admin'];

/**
 * Parse bearer token from Authorization header.
 */
function getBearerToken(req) {
  const hdr = req.headers['authorization'] || '';
  const parts = hdr.split(' ');
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return parts[1];
  return null;
}

/**
 * Very naive JWT body parse (base64 decode payload only). Not secure validation.
 */
function tryParseJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (_e) {
    return null;
  }
}

/**
 * Attach auth info to request: user, roles, scopes.
 * Supports:
 * - Bearer JWT with "sub", "roles"
 * - x-api-key header matching MONITORING_INGEST_API_KEY for ingestion endpoints
 */
function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const ingestKey = process.env.MONITORING_INGEST_API_KEY;
  const token = getBearerToken(req);

  let principal = {
    isAuthenticated: false,
    isApiKey: false,
    subject: 'anonymous',
    roles: ['viewer'],
    raw: null,
  };

  if (apiKey && ingestKey && apiKey === ingestKey) {
    principal = {
      isAuthenticated: true,
      isApiKey: true,
      subject: 'ingest-client',
      roles: ['operator'], // allow ingestion privileges
      raw: { type: 'api-key' },
    };
  } else if (token) {
    const payload = tryParseJwtPayload(token);
    if (payload) {
      principal = {
        isAuthenticated: true,
        isApiKey: false,
        subject: payload.sub || 'user',
        roles: Array.isArray(payload.roles) && payload.roles.length ? payload.roles : ['viewer'],
        raw: payload,
      };
    }
  }

  req.principal = principal;
  next();
}

/**
 * Require minimum role in hierarchy.
 * @param {('viewer'|'analyst'|'operator'|'admin')} minRole
 */
function requireRole(minRole) {
  return (req, res, next) => {
    const userRoles = req.principal?.roles || ['viewer'];
    const maxUserRank = Math.max(...userRoles.map(r => rolesHierarchy.indexOf(r)).filter(i => i >= 0));
    const needRank = rolesHierarchy.indexOf(minRole);
    if (maxUserRank >= needRank) return next();
    return res.status(403).json({ code: 'forbidden', message: 'Insufficient role' });
  };
}

module.exports = {
  authenticate,
  requireRole,
};
