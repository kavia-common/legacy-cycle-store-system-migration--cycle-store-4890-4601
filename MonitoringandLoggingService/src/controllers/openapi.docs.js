/**
 * @swagger
 * /api/v1/logs:
 *   post:
 *     summary: Ingest a log entry
 *     description: Accepts ELK-compatible log payloads and stores/forwards them.
 *     tags: [Ingestion]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogEntry'
 *     responses:
 *       201:
 *         description: Log entry created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *
 * /api/v1/metrics:
 *   post:
 *     summary: Report a metric entry
 *     tags: [Ingestion]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetricEntry'
 *     responses:
 *       201:
 *         description: Metric entry created
 *
 * /api/v1/alerts:
 *   get:
 *     summary: List alerts
 *     tags: [Alerts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, RESOLVED] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paged list of alerts
 *   post:
 *     summary: Create an alert
 *     tags: [Alerts]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alert'
 *     responses:
 *       201:
 *         description: Created
 *
 * /api/v1/alerts/{id}/resolve:
 *   patch:
 *     summary: Resolve an alert by ID
 *     tags: [Alerts]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Resolved alert }
 *       404: { description: Not found }
 *
 * /api/v1/alerts/rules:
 *   get:
 *     summary: List alert rules
 *     tags: [AlertRules]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of rules }
 *   post:
 *     summary: Create or update an alert rule
 *     tags: [AlertRules]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AlertRule' }
 *     responses:
 *       201: { description: Saved }
 *
 * /api/v1/alerts/rules/{id}:
 *   delete:
 *     summary: Delete alert rule
 *     tags: [AlertRules]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 *
 * /api/v1/dashboard:
 *   get:
 *     summary: Retrieve dashboard data
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard data }
 *
 * /api/v1/compliance/audit:
 *   get:
 *     summary: Generate audit report
 *     tags: [Compliance]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200: { description: Audit report }
 */
