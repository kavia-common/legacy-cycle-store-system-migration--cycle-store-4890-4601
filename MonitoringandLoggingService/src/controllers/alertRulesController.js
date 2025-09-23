'use strict';

const rulesService = require('../services/alertRulesService');

function getRules(_req, res) {
  return res.json(rulesService.listRules());
}

function postRule(req, res) {
  const saved = rulesService.upsertRule(req.body, req.user?.sub);
  return res.status(201).json(saved);
}

function deleteRule(req, res) {
  const ok = rulesService.deleteRule(req.params.id, req.user?.sub);
  if (!ok) return res.status(404).json({ error: 'not_found', message: 'Rule not found' });
  return res.status(204).send();
}

module.exports = { getRules, postRule, deleteRule };
