const url = require('url');
const fetch = require('node-fetch');

const {getCookie, setCookie, formatCookie} = require('./cookieStore')

module.exports = async function(options, projectOptions = {}) {
  const requestUrl = getRequestUrl(options);
  const cookies = getCookie(projectOptions);
  const fetchOptions = getFetchOptions(options, cookies);

  response = await fetch(requestUrl, fetchOptions)

  updateCookieStore(response, cookies, projectOptions)

  return {
    headers: response.headers.raw(),
    body: await response.text(),
    status: response.status,
    statusText: response.statusText,
  }
}

function getRequestUrl(options) {
  const baseUrl = options.baseUrl;
  const pathName = options.path;
  const queryString = queryToString(options.query);

  let requestUrl = url.resolve(baseUrl, pathName);
  if (queryString) {
    requestUrl = combineQueryString(requestUrl, queryString);
  }
  return requestUrl
}

function queryToString(query) {
  if (typeof query === 'string') {
    return query;
  }
  let result = []
  for (let i in query) {
    if (!query.hasOwnProperty(i)) {
      continue
    }
    result.push(`${i}=${query[i]}`)
  }
  return result.join('&')
}

function getFetchOptions(options, cookies) {
  const fetchOptions = Object.assign({
    method: 'GET',
    headers: {},
  }, options)
  if (fetchOptions.method === 'GET') {
    delete fetchOptions.body
  }
  if (cookies) {
    fetchOptions.headers.Cookie = formatCookie(cookies);
  }
  return fetchOptions
}

function combineQueryString(requestUrl, queryString) {
  const joinOperator = requestUrl.includes('?') ? '&' : '?';
  return `${requestUrl}${joinOperator}${queryString}`
}

function updateCookieStore(response, cookies, projectOptions) {
  const newCookies = response.headers.getAll('set-cookie');
  setCookie(newCookies, cookies, projectOptions)
}
