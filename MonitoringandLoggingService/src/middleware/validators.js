'use strict';

/**
 * Basic schema validation helpers for incoming payloads.
 * Keep it lightweight; for production integrate Ajv or Joi.
 */

function isIsoDateString(s) {
  if (typeof s !== 'string') return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}

function validateLogEntry(body) {
  const errors = [];
  if (!isIsoDateString(body.timestamp)) errors.push('timestamp (ISO 8601) is required');
  if (!['DEBUG', 'INFO', 'WARN', 'ERROR'].includes(body.level)) errors.push('level must be one of DEBUG, INFO, WARN, ERROR');
  if (typeof body.message !== 'string' || !body.message.length) errors.push('message is required');
  if (typeof body.source !== 'string' || !body.source.length) errors.push('source is required');
  if (body.context && typeof body.context !== 'object') errors.push('context must be an object if provided');
  return errors;
}

function validateMetricEntry(body) {
  const errors = [];
  if (!isIsoDateString(body.timestamp)) errors.push('timestamp (ISO 8601) is required');
  if (typeof body.name !== 'string' || !body.name.length) errors.push('name is required');
  if (typeof body.value !== 'number') errors.push('value must be number');
  if (body.labels && typeof body.labels !== 'object') errors.push('labels must be an object if provided');
  return errors;
}

function validateAlert(body) {
  const errors = [];
  if (typeof body.id !== 'string' || !body.id.length) errors.push('id is required');
  if (!['ACTIVE', 'RESOLVED'].includes(body.status)) errors.push('status must be ACTIVE or RESOLVED');
  if (typeof body.message !== 'string' || !body.message.length) errors.push('message is required');
  if (!isIsoDateString(body.createdAt)) errors.push('createdAt must be ISO 8601 string');
  if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(body.severity)) errors.push('severity invalid');
  return errors;
}

function validateAlertRule(body) {
  const errors = [];
  if (typeof body.id !== 'string' || !body.id.length) errors.push('id is required');
  if (typeof body.name !== 'string' || !body.name.length) errors.push('name is required');
  if (typeof body.expression !== 'string' || !body.expression.length) errors.push('expression is required');
  if (typeof body.enabled !== 'boolean') errors.push('enabled must be boolean');
  if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(body.severity)) errors.push('severity invalid');
  return errors;
}

module.exports = {
  validateLogEntry,
  validateMetricEntry,
  validateAlert,
  validateAlertRule,
};
