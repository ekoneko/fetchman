const url = require('url');
const fetch = require('node-fetch');

module.exports = (options) => {
  const requestUrl = getRequestUrl(options);
  const fetchOptions = getFetchOptions(options);
  let headers, status, statusText;

  return fetch(requestUrl, fetchOptions)
    .then(response => {
      headers = response.headers.raw();
      status = response.status;
      statusText = response.statusText;
      return response.text()
    })
    .then(body => {
      return {
        headers,
        body,
        status,
        statusText,
      }
    })
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

function getFetchOptions(options) {
  const {method, headers} = options
  return {
    method,
    headers,
  }
}

function combineQueryString(requestUrl, queryString) {
  const joinOperator = requestUrl.includes('?') ? '&' : '?';
  return `${requestUrl}${joinOperator}${queryString}`
}
