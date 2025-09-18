const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Monitoring REST API',
      version: '1.0.0',
      description:
        'RESTful API for log ingestion, metrics reporting, alert management, and dashboard data retrieval. Secure, role-based access. JSON payloads.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LogEntry: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            level: { type: 'string', enum: ['DEBUG', 'INFO', 'WARN', 'ERROR'] },
            message: { type: 'string' },
            source: { type: 'string' },
            context: { type: 'object', additionalProperties: true },
          },
          required: ['timestamp', 'level', 'message', 'source'],
        },
        MetricEntry: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            name: { type: 'string' },
            value: { type: 'number' },
            labels: { type: 'object', additionalProperties: { type: 'string' } },
          },
          required: ['timestamp', 'name', 'value'],
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string', enum: ['ACTIVE', 'RESOLVED'] },
            message: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          },
          required: ['id', 'status', 'message', 'createdAt', 'severity'],
        },
        AlertRule: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            expression: { type: 'string' },
            enabled: { type: 'boolean' },
            severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
          },
          required: ['id', 'name', 'expression', 'enabled', 'severity'],
        },
        DashboardData: {
          type: 'object',
          properties: {
            widgets: { type: 'array', items: { type: 'object' } },
          },
          required: ['widgets'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'string' },
          },
          required: ['code', 'message'],
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health', description: 'Service health and readiness' },
      { name: 'Ingestion', description: 'Log and metric ingestion endpoints' },
      { name: 'Alerts', description: 'Alert listing and rule management' },
      { name: 'Dashboard', description: 'Dashboard aggregation and widgets' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
