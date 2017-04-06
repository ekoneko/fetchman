const fs = require('fs');
const path = require('path');
const parseItem = require('../../lib/parseItem')

const pathName = path.resolve(__dirname, '../project/simple.item');
const text = fs.readFileSync(pathName).toString();

it('parse item file', done => {
  const params = parseItem(text);
  if (params.method !== 'GET') {
    return done(new Error('method not match'));
  }
  if (params.path !== '/simple') {
    return done(new Error('path not match'));
  }
  if (params.query !== 'a=1&b=2&c=3') {
    return done(new Error('query not match'));
  }
  if (params.headers['X-test'] !== 'test') {
    return done(new Error('headers not match'));
  }
  if (params.body !== 'test body\nline2\nline3\n$$') {
    return done(new Error('body not match'));
  }
  done()
})
