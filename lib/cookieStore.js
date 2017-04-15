const fs = require('fs')
const path = require('path')
const setCookieParse = require('set-cookie-parser');

module.exports.formatCookie = function formatCookie(cookies) {
  const result = []
  const now = new Date();
  cookies.forEach(cookie => {
    if (cookie.expires && new Date(cookie.expires) < now) {
      return;
    }
    result.push(`${cookie.name}=${cookie.value}`)
  })
  return result.join('; ')
}

module.exports.getCookie = function getCookie(projectOptions = {}) {
  if (!projectOptions.path) {
    return
  }
  const cookiePath = path.join(projectOptions.path, '.cookie')
  if (!fs.existsSync(cookiePath)) {
    return
  }
  const cookieString = fs.readFileSync(cookiePath).toString()
  const cookies = JSON.parse(cookieString);
  if (!(cookies instanceof Array)) {
    return
  }
  return cookies
}

module.exports.setCookie = function setCookie(newCookies = [], cookies, projectOptions = {}) {
  if (!newCookies.length || !projectOptions.path) {
    return
  }
  const formattedCookie = setCookieParse(newCookies)
  const combinedCookies = combineCookies(formattedCookie, cookies)
  const cookiePath = path.join(projectOptions.path, '.cookie')
  fs.writeFileSync(cookiePath, JSON.stringify(combinedCookies, null, 2))
}

module.exports.cleanCookies = function cleanCookies(projectOptions = {}) {
  if (!projectOptions.path) {
    return
  }
  const cookiePath = path.join(projectOptions.path, '.cookie')
  if (!fs.existsSync(cookiePath)) {
    return
  }
  fs.unlinkSync(cookiePath)
}

function combineCookies(cookies1 = [], cookies2 = []) {
  const result = [];
  const resultNames = [];
  const now = new Date();
  cookies1.forEach(cookie => {
    if (cookie.expires && new Date(cookie.expires) < now) {
      resultNames.push(cookie.name)
      return;
    }
    result.push(cookie);
    resultNames.push(cookie.name)
  });
  cookies2.forEach(cookie => {
    if (cookie.expires && new Date(cookie.expires) < now) {
      return;
    }
    if (resultNames.includes(cookie.name)) {
      return;
    }
    result.push(cookie);
    resultNames.push(cookie.name)
  })
  return result;
}
