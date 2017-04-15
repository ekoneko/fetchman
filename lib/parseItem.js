module.exports = (text) => {
  const lines = text.split(/[\r\n]/)
  let result = readLines(lines)
  result = format(result);
  return result
}

function readLines(lines) {
  let result = {}
  let i = 0;
  while (i < lines.length) {
    const {jumpCount, value} = readLine(lines[i], i,  lines);
    if (typeof value === 'object' && value) {
      result = combine(result, value);
    }
    i += jumpCount;
  }
  return result
}

function readLine(line, i, lines) {
  if (isBody(line)) {
    const {body, lineCount} = readBody(i + 1, lines);
    return {
      jumpCount: lineCount + 1,
      value: {body}
    }
  } else {
    const value = parseLine(line)
    return {
      jumpCount: 1,
      value,
    }
  }
}

function isBody(line) {
  return line.match(/^body:\s*$/)
}

function isBodyEnd(line) {
  return line === '$$'
}

function dealEOF(line) {
  return line.replace('$$', '$')
}

function readBody(startLine, lines) {
  let body = [];
  let i = startLine;
  while (i < lines.length) {
    const line = lines[i];
    if (isBodyEnd(line)) {
      break;
    }
    body.push(dealEOF(line));
    i += 1;
  }
  return {
    body: body.join('\n'),
    lineCount: i - startLine
  };
}

function parseLine(line) {
  const splits = line.split(':');
  if (splits.length < 2) {
    return
  }
  const name = splits[0].trim()
  const value = splits[1].trim()
  if (!name.match(/^\w+$/) || !value) {
    return
  }
  const result = {};
  result[name] = value;
  return result
}

function combine(value, append) {
  for (let key in append) {
    if (!append.hasOwnProperty(key)) {
      continue;
    }
    if (value[key]) {
      if (!(value[key] instanceof Array)) {
        value[key] = [value[key]];
      }
      value[key].push(append[key]);
    } else {
      value[key] = append[key];
    }
  }
  return value;
}

function format(params = {}) {
  if (params.query && params.query instanceof Array) {
    params.query = params.query.join('&').split('&');
    params.query = formatQuery(params.query);
  }
  if (params.header) {
    if (!params.headers) {
      params.headers = [];
    } else if (typeof params.headers === 'string') {
      params.headers = [params.headers];
    }
    if (typeof params.header === 'string') {
      params.headers.push(params.header);
    } else {
      params.headers = params.headers.concat(params.header);
    }
    delete params.header;
  }
  if (params.headers) {
    if (typeof params.headers === 'string') {
      params.headers = [params.headers];
    }
    params.headers = transformHeader(params.headers);
  }
  return params;
}

function formatQuery(queryArray) {
  const query = {}
  queryArray.forEach(item => {
    const [name, value] = item.split('=')
    query[name] = value
  })
  return query
}

function transformHeader(headers) {
  const headerObj = {}
  headers.forEach(line => {
    const splits = line.split('=')
    if (splits.length < 2) {
      return;
    }
    const name = splits.shift().trim();
    headerObj[name] = splits.join('=');
  })
  return headerObj;
}
