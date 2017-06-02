const createProject = require('./lib/createProject')
const createItem = require('./lib/createItem')
const fetchman = require('./lib/fetchman')

module.exports = {
  createProject(projectName) {
    createProject(projectName)
  },
  createItem(itemName) {
    createItem(itemName)
  },
  request: async function (itemName, flags) {
    const output = fetchman(itemName, flags)
    process.stdout.write(output)
  },
}
