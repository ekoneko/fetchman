const fs = require('fs');
const path = require('path');
const parseItem = require('../lib/parseItem')
const request = require('../lib/request')
const fetchman = require('../lib/fetchman')
const {createApp, getBaseUrl} = require('./utils/createApp')

createApp()
const baseUrl = getBaseUrl()

const projectPath = path.resolve(__dirname, './project');
const itemName = 'simple.item';
const pathName = path.resolve(projectPath, itemName);
const text = fs.readFileSync(pathName).toString();

const commonPath = path.resolve(projectPath, '.fetchman');
const commonText = fs.readFileSync(commonPath).toString();

it('parse item file', done => {
  const params = parseItem(text);
  if (params.method !== 'GET') {
    return done(new Error('method not match'));
  }
  if (params.path !== '/simple') {
    return done(new Error('path not match'));
  }
  if (typeof params.query !== 'object' ||
      params.query.a !== '1' ||
      params.query.b !== '2' ||
      params.query.c !== '3'
  ) {
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

const paramsWithCommon = parseItem(commonText + text)
it('with common config', done => {
  const params = paramsWithCommon;
  if (typeof params.query !== 'object' ||
      params.query.a !== '1' ||
      params.query.d !== '4'
  ) {
    return done(new Error('query not match'));
  }
  if (params.headers['X-test'] !== 'test' ||
      params.headers['X-test2'] !== 'test2'
  ) {
    return done(new Error('headers not match'));
  }
  done();
})

it('request from file and return body', async () => {
  const res = await fetchman(itemName, {}, projectPath, {
    baseUrl,
  })
  if (res[0] !== '{') {
    throw new Error('response not body')
  }
})

it('request from file and return head', async () => {
  const res = await fetchman(itemName, {I: true}, projectPath, {
    baseUrl,
  })
  if (!res.includes('HTTP 200 OK')) {
    throw new Error('response not expect head')
  }

  if (res.includes('{')) {
    throw new Error('should not response body')
  }
})

it('request from file and return head and body', async () => {
  const res = await fetchman(itemName, {i: true}, projectPath, {
    baseUrl,
  })
  if (!res.includes('HTTP 200 OK')) {
    throw new Error('response not expect head')
  }

  if (!res.includes('{')) {
    throw new Error('not response body')
  }
})
