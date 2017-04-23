const fs = require('fs-extra')
const path = require('path')
const createProject = require('../lib/createProject')

const testProjectName = 'testProject'
const testProjectPath = path.resolve(__dirname, testProjectName)

const initTest = function () {
  if (fs.existsSync(testProjectPath)) {
    fs.removeSync(testProjectPath)
  }
}

it('create project', async () => {
  initTest()
  createProject(testProjectName, __dirname)
  const isFetchmanExists = fs.existsSync(path.join(testProjectPath, '.fetchman'))
  initTest()
  if (!isFetchmanExists) {
    throw new Error('.fetchman not created')
  }
})
