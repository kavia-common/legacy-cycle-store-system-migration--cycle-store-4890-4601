const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/v1', require('./routes/api'));

// error handler
// PUBLIC_INTERFACE
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Monitoring error', err);
  res.status(err.status || 500).json({ code: 'ERR', message: err.message });
});

module.exports = app;
