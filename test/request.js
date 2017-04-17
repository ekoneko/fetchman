const request = require('../lib/request')
const {createApp, getBaseUrl} = require('./utils/createApp')

createApp()
const baseUrl = getBaseUrl()

it('simple request', async () => {
  const res = await request({
    baseUrl,
    path: '/simple',
    query: {
      a: 1,
      b: 2,
    },
    method: 'GET',
    headers: {"X-test": "test"}
  });

  if (res.status !== 200) {
    throw new Error('status not 200')
  }
  const body = JSON.parse(res.body);
  if (body.a !== '1' || body.b !== '2') {
    throw new Error('response is not excepted');
  }
})
