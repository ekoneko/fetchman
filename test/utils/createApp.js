let isAppInitialized = false
const port = process.env.PORT || 3000;

module.exports.createApp = function createApp() {
  if (!isAppInitialized) {
    const app = require('../server/app');
    app.listen(port);
    isAppInitialized = true
  }
}

module.exports.getBaseUrl = function getBaseUrl() {
  return `http://localhost:${port}`
}
