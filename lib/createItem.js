const fs = require('fs-extra')
const path = require('path')
const childProcess = require('child_process')

const itemTemplatePath = path.resolve(__dirname, '../data/item-template')

module.exports = async function (itemName, cwd = process.cwd()) {
  const itemPath = path.join(cwd, itemName)
  if (fs.existsSync(itemPath)) {
    process.stdout.write(`Error: ${itemName} exists`)
    return process.exit()
  }
  fs.copySync(itemTemplatePath, itemPath)
  await spawnEditorProcess(itemPath)
  process.stdout.write(`create item [${itemName}] success`)
}

function spawnEditorProcess(tmpFile) {
  return new Promise(resolve => {
    const editor = process.env.EDITOR || 'vi';
    const child = childProcess.spawn(editor, [tmpFile], {
      stdio: 'inherit'
    });
    child.on('exit', () => {
      resolve()
    });
  })
}
