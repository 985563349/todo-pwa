const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const webpush = require('web-push');
const { union, xor } = require('lodash');

const app = new Koa();
const router = new Router();

const vapidKeys = {
  publicKye:
    'BLEpPAE5nG5vV-bDgJgBtGE3vASMQGSEz_l5-nK0qH0Z_lI9RzpXZ87pX8g-Gq8SbasiKx-p4uMjJqUJ0pYfIe4',
  privateKey: 'cJ_TfetLIyVwF_6A4UQVypLNkCCloGGOpNeygumWXFk',
};

webpush.setVapidDetails(
  'mailto:jie985563349@outlook.com',
  vapidKeys.publicKye,
  vapidKeys.privateKey
);

let subscription = null;

let todos = ['eat'];

router.get('/todo/find-all', (ctx) => {
  ctx.body = todos;
});

router.post('/todo/create', (ctx) => {
  const data = ctx.request.body;
  todos.push(data);
  ctx.body = 'created succeeded.';
});

router.post('/todo/sync', (ctx) => {
  const data = ctx.request.body;
  todos = union(todos, data);
  ctx.body = xor(todos, data);
});

router.post('/subscribe', (ctx) => {
  subscription = ctx.request.body;
  webpush.sendNotification(
    subscription,
    JSON.stringify({ message: 'subscription succeeded.', type: 'subscribe' })
  );
  ctx.body = 'subscription succeeded.';
});

router.post('/ping', (ctx) => {
  setTimeout(() => {
    webpush.sendNotification(subscription, JSON.stringify({ message: 'Pong', type: 'ping' }));
  }, 1000);
  ctx.body = null;
});

app.use(koaBody());
app.use(router.routes());
app.use(serve(__dirname + '/public'));

app.listen(8081, () => {
  console.log('server running at http://localhost:8081');
});
