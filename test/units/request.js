const request = require('../../lib/request')

const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;

it('simple request', done => {
  request({
    baseUrl,
    path: '/simple',
    query: {
      a: 1,
      b: 2,
    },
    method: 'GET',
    headers: {"X-test": "test"}
  }).then(res => {
    if (res.status !== 200) {
      throw new Error('status not 200')
    }
    const body = JSON.parse(res.body);
    if (body.a === '1' && body.b === '2') {
      done();
    } else {
      throw new Error('response is not excepted');
    }
  }).catch(err => done(err))
})
