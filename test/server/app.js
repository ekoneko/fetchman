const Koa = require('koa');
const app = module.exports = new Koa();
const Router = require('koa-router');
const router = new Router();

const auth = Math.random().toString().slice(-6);

router.get('/simple', ctx => {
  if (!ctx.headers['x-test']) {
    ctx.status = 500;
    return;
  }
  ctx.body = ctx.query;
});

router.post('/login', ctx => {
  ctx.cookies.set('auth', auth, {
    maxAge: 864e5
  });
  ctx.cookies.set('test', 'test', {maxAge: 864e5})
  ctx.body = ''
})

router.post('/logout', ctx => {
  ctx.cookies.set('auth', auth, {
    expires: new Date(0),
  });
  ctx.body = ''
})

router.get('/withAuth', ctx => {
  ctx.body = ctx.cookies.get('auth') === auth ? 'isLogin': 'isNotLogin'
})

app.use(router.routes());
