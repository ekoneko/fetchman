module.exports = function formatRequest(res, flags = {}) {
  if (flags.I) {
    return outputHead(res)
  } else if (flags.i) {
    return outputHeadAndBody(res)
  }
  return outputBody(res)
}

function outputHead(res) {
  const result = []
  result.push(`HTTP ${res.status} ${res.statusText}`)
  for (const key in res.headers) {
    const value = res.headers[key]
    result.push(`${key}: ${outPutHeaderValue(value)}`)
  }
  return result.join('\n');
}

function outputBody(res) {
  return res.body;
}

function outputHeadAndBody(res) {
  return [outputHead(res), outputBody(res)].join('\n\n')
}

function outPutHeaderValue(value) {
  if (typeof value === 'string') {
    return value
  }
  if (value instanceof Array) {
    return value.join(' ')
  }
  return ''
}
