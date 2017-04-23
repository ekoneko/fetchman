const fs = require('fs-extra')
const path = require('path')

const fetchmanTemplatePath = path.resolve(__dirname, '../data/fetchman-template')

module.exports = function (projectName, cwd = process.cwd()) {
  const projectPath = path.join(cwd, projectName)
  fs.mkdirSync(projectPath)
  fs.copySync(fetchmanTemplatePath, path.join(projectPath, '.fetchman'))
  process.stdout.write(`Created a fetchman project: ${projectName}`)
}
