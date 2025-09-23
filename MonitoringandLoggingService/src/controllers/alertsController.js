/**
 * Simple alerts controller storing alerts in-memory.
 */
const store = { alerts: [], rules: [] };

// PUBLIC_INTERFACE
exports.list = async (req, res) => {
  const { status } = req.query;
  const filtered = status ? store.alerts.filter(a => a.status === status) : store.alerts;
  return res.status(200).json(filtered);
};

// PUBLIC_INTERFACE
exports.create = async (req, res) => {
  const alert = { ...req.body };
  store.alerts.push(alert);
  return res.status(201).json(alert);
};

// PUBLIC_INTERFACE
exports.listRules = async (req, res) => {
  return res.status(200).json(store.rules);
};

// PUBLIC_INTERFACE
exports.upsertRule = async (req, res) => {
  const rule = req.body;
  const idx = store.rules.findIndex(r => r.id === rule.id);
  if (idx >= 0) store.rules[idx] = rule; else store.rules.push(rule);
  return res.status(201).json(rule);
};
