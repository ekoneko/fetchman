const fs = require('fs')
const request = require('../lib/request')
const {createApp, getBaseUrl} = require('./utils/createApp')
const {getProjectPath} = require('./utils/project')
const {cleanCookies, getCookie} = require('../lib/cookieStore')

createApp()
const baseUrl = getBaseUrl()
const projectPath = getProjectPath()

const projectOptions = {
  path: projectPath,
}

cleanCookies(projectOptions);

function login() {
  return request({
    baseUrl,
    path: '/login',
    method: 'POST',
  }, projectOptions)
    .then(res => {
      if (res.status !== 200) {
        throw new Error('login failed')
      }
      return res;
    })
}

function logout() {
  return request({
    baseUrl,
    path: '/logout',
    method: 'POST',
  }, projectOptions)
    .then(res => {
      if (res.status !== 200) {
        throw new Error('logout failed')
      }
      return res;
    })
}

function withAuth() {
  return request({
    baseUrl,
    path: '/withAuth',
    method: 'GET',
  }, projectOptions)
    .then(res => {
      if (res.status !== 200) {
        throw new Error('request with auth failed')
      }
      return res;
    })
}

it('not login', done => {
  withAuth().then(res => {
    if (res.body !== 'isNotLogin') {
      throw new Error('got "already login" response')
    }
    done()
  }).catch(err => {
    done(err)
  })
})

it('login and logout', done => {
  login()
    .then(withAuth)
    .then(res => {
      if (res.body !== 'isLogin') {
        throw new Error('got "not login" response')
      }
      const cookie = getCookie(projectOptions);
      if (cookie.length !== 2) {
        throw new Error('cookie count should be 2')
      }
    })
    .then(logout)
    .then(withAuth)
    .then(res => {
      if (res.body !== 'isNotLogin') {
        throw new Error('got "already login" response')
      }
      const cookie = getCookie(projectOptions);
      if (cookie.length !== 1) {
        throw new Error('cookie count should be 1')
      }
      done()
    })
    .catch(err => {
      done(err)
    })
})
