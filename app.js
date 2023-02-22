const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

app.use(serve(__dirname + '/public'));

app.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
