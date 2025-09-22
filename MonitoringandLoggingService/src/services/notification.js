'use strict';

const http = require('http');
const https = require('https');
const { URL } = require('url');
const config = require('../config');

/**
 * Minimal HTTP client using Node's http/https to avoid extra dependencies.
 * Used to send notifications to NotificationService when alerts are triggered.
 */
function postJson(urlStr, body, headers = {}) {
  return new Promise((resolve, reject) => {
    if (!urlStr) {
      // No-op if not configured
      return resolve({ statusCode: 204, body: null });
    }
    try {
      const url = new URL(urlStr);
      const lib = url.protocol === 'https:' ? https : http;
      const data = JSON.stringify(body);
      const opts = {
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + (url.search || ''),
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...headers,
        },
      };
      const req = lib.request(opts, (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          const responseBody = Buffer.concat(chunks).toString();
          resolve({ statusCode: res.statusCode || 0, body: responseBody });
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

// PUBLIC_INTERFACE
async function sendAlertNotification({ message, severity, correlationId }) {
  /** Send an alert notification to the NotificationService (placeholder). */
  if (!config.notificationServiceUrl) {
    return { ok: true, skipped: true, reason: 'notification service url not configured' };
  }
  const payload = {
    type: 'email',
    recipients: [{ recipientId: 'ops', type: 'admin' }],
    templateId: 'alert-template',
    parameters: {
      message,
      severity,
      correlationId: correlationId || '',
      service: config.serviceName,
    },
  };

  const headers = {};
  if (config.notificationServiceToken) {
    headers.Authorization = `Bearer ${config.notificationServiceToken}`;
  }
  try {
    const res = await postJson(
      new URL('/notifications/send', config.notificationServiceUrl).toString(),
      payload,
      headers
    );
    return { ok: res.statusCode >= 200 && res.statusCode < 300, statusCode: res.statusCode };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

module.exports = {
  sendAlertNotification,
};
