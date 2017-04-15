const fs = require('fs');
const path = require('path');
const parseItem = require('../lib/parseItem')
const request = require('../lib/request')
const {createApp, getBaseUrl} = require('./utils/createApp')

createApp()
const baseUrl = getBaseUrl()

const pathName = path.resolve(__dirname, './project/simple.item');
const text = fs.readFileSync(pathName).toString();

const commonPath = path.resolve(__dirname, './project/.fetchman');
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

it('request from file', done => {
  request(Object.assign({
    baseUrl,
  }, paramsWithCommon)).then(res => {
    if (res.status !== 200) {
      throw new Error('status not 200')
    }
    const body = JSON.parse(res.body);
    if (body.a === '1' && body.d === '4') {
      done();
    } else {
      throw new Error('response is not excepted');
    }
  })
})
