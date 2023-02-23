const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const webpush = require('web-push');

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

router.post('/subscribe', (ctx) => {
  const subscription = ctx.request.body;
  webpush.sendNotification(
    subscription,
    JSON.stringify({ message: 'subscription succeeded.', type: 'subscribe' })
  );
  ctx.body = 'subscription succeeded.';
});

app.use(koaBody());
app.use(router.routes());
app.use(serve(__dirname + '/public'));

app.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
