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

async function login() {
  const res = await request({
    baseUrl,
    path: '/login',
    method: 'POST',
  }, projectOptions);

  if (res.status !== 200) {
    throw new Error('login failed')
  }
  return res;
}

async function logout() {
  const res = await request({
    baseUrl,
    path: '/logout',
    method: 'POST',
  }, projectOptions)

  if (res.status !== 200) {
    throw new Error('logout failed')
  }
  return res;
}

async function withAuth() {
  const res = await request({
    baseUrl,
    path: '/withAuth',
    method: 'GET',
  }, projectOptions)

  if (res.status !== 200) {
    throw new Error('request with auth failed')
  }
  return res;
}

it('not login', async () => {
  const res = await withAuth()
  if (res.body !== 'isNotLogin') {
    throw new Error('got "already login" response')
  }
})

it('login and logout', async () => {
  await login()
  const noAuthRes = await withAuth()
  if (noAuthRes.body !== 'isLogin') {
    throw new Error('got "not login" response')
  }
  const AuthCookie = getCookie(projectOptions);
  if (AuthCookie.length !== 2) {
    throw new Error('cookie count should be 2')
  }
  await logout()
  const authRes = await withAuth()
  if (authRes.body !== 'isNotLogin') {
    throw new Error('got "already login" response')
  }
  const noAuthCookie = getCookie(projectOptions);
  if (noAuthCookie.length !== 1) {
    throw new Error('cookie count should be 1')
  }
})
