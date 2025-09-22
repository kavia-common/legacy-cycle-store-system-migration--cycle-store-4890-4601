const { correlationIdMiddleware } = require('./correlation');
const logger = require('./logger');

// This file exports middleware helpers
module.exports = {
  correlationIdMiddleware,
  logger,
};
