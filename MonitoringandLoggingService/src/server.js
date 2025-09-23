const app = require('./app');
const PORT = process.env.PORT || 4014;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MonitoringandLoggingService listening on :${PORT}`);
});
