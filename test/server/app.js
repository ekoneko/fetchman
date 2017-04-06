const Koa = require('koa');
const app = module.exports = new Koa();
const Router = require('koa-router');
const router = new Router();

router.get('/simple', ctx => {
  if (!ctx.headers['x-test']) {
    ctx.status = 500;
    return;
  }
  ctx.cookies.set('auth', Math.random().toString().slice(-6), {
    maxAge: 864e5
  });
  ctx.body = ctx.query;
});

app.use(router.routes());
