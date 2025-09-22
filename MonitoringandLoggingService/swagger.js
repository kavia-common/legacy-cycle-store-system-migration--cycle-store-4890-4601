const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monitoring and Logging Service API',
      version: '1.0.0',
      description: 'REST API for log ingestion, metrics reporting, alert management, and dashboard data.',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Logs', description: 'Log ingestion and listing' },
      { name: 'Metrics', description: 'Metric ingestion and listing' },
      { name: 'Alerts', description: 'Alert and alert rule management' },
      { name: 'Dashboard', description: 'Dashboard data' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
