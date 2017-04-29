const fs = require('fs-extra')
const path = require('path')

const parseItem = require('./parseItem')
const request = require('./request')
const formatRequest = require('./formatRequest')

module.exports = async function parseToRequest(
  fileName,
  flags,
  projectPath = process.cwd(),
  testAppend = {}
) {
  const text = parseCommon(projectPath) + parseContent(fileName, projectPath)
  // testAppend: append baseUrl in unit test
  const options = Object.assign(testAppend, parseItem(text))
  const projectOptions = getProjectOptions(projectPath)
  const res = await request(options, projectOptions)
  const output = formatRequest(res, flags)
  process.stdout.write(output)
}

function parseContent (fileName, projectPath) {
  const content = readFile(fileName, projectPath)
  if (!content) {
    process.stdout.write(`Error: Cannot find [${fileName}] in project`)
    process.exit()
    return
  }
  return content
}

function parseCommon(projectPath) {
  return readFile('.fetchman', projectPath) || ''
}

function readFile(fileName, projectPath) {
  const filePath = path.resolve(projectPath, fileName)
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath).toString()
}

function getProjectOptions(projectPath) {
  return {
    path: projectPath,
  }
}
