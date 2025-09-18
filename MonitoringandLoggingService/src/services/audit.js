'use strict';

const { audits } = require('./store');

/**
 * PUBLIC_INTERFACE
 * writeAudit
 * Records an audit entry for compliance. Not persisted beyond memory in this demo.
 */
function writeAudit({ actor = 'system', action, resource, details = {} }) {
  /** Records an audit trail entry for compliance reporting. */
  const entry = {
    actor,
    action,
    resource,
    details,
    ip: details.ip || null,
    at: new Date().toISOString(),
  };
  audits.push(entry);
  return entry;
}

module.exports = {
  writeAudit,
};
