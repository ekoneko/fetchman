const path = require('path');

module.exports.getProjectPath = function getProjectPath() {
  return path.resolve(__dirname, '../project')
}
