const childProcess = require('child_process');
const fs = require('fs');

module.exports = async function callEdit(tmpFile, templateContent) {
  fs.writeFileSync(tmpFile, templateContent)
  await spawnEditorProcess(tmpFile)
  return fs.readFileSync(tmpFile).toString()
}

function spawnEditorProcess(tmpFile) {
  return new Promise(resolve => {
    const editor = process.env.EDITOR || 'vi';
    const child = childProcess.spawn(editor, [tmpFile], {
      stdio: 'inherit'
    });
    child.on('exit', () => {
      console.log('resolve')
      resolve()
    });
  })
}
