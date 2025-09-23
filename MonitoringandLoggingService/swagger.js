const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Monitoring and Logging Service API',
      version: '1.0.0',
      description: 'REST API for log/metric ingestion, alerts, rules, dashboard, and compliance reporting with RBAC and ELK-compatible output',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Ingestion', description: 'Log and metric ingestion' },
      { name: 'Alerts', description: 'Operational alerts' },
      { name: 'AlertRules', description: 'Alert rule management' },
      { name: 'Dashboard', description: 'Operational dashboard data' },
      { name: 'Compliance', description: 'Audit and compliance reports' }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
