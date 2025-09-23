'use strict';
const config = require('../config');

module.exports = function requestLogger() {
  return (req, _res, next) => {
    if (config.requestLogging) {
      const start = Date.now();
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      // log only path, method to avoid sensitive data
      // eslint-disable-next-line no-console
      console.log(`[REQ] ${req.method} ${req.originalUrl} from ${ip}`);
      req.on('end', () => {
        const ms = Date.now() - start;
        // eslint-disable-next-line no-console
        console.log(`[END] ${req.method} ${req.originalUrl} in ${ms}ms`);
      });
    }
    next();
  };
};
