'use strict';

const storage = require('./storage');

// PUBLIC_INTERFACE
async function ingestLog({ timestamp, level, message, source, context }, correlationId) {
  /** Validate and persist a log entry. */
  if (!timestamp || !level || !message || !source) {
    const err = new Error('timestamp, level, message, source are required');
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
  const entry = {
    timestamp,
    level,
    message,
    source,
    context: context || {},
    correlationId: correlationId || '',
  };
  await storage.addLog(entry);
  return entry;
}

// PUBLIC_INTERFACE
function listLogs() {
  /** Return in-memory logs (placeholder for ELK integration). */
  return storage.listLogs();
}

module.exports = {
  ingestLog,
  listLogs,
};
