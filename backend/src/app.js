const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const database = require('./database');

/** CREATE AND CONF THE WEB SERVER * */

/* eslint-disable-next-line no-multi-assign */
const app = module.exports = new Koa();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

app.use(cors({ credentials: true }));
app.use(bodyParser());

/** METHODS TO RESPOND TO THE ROUTES * */

const listGreetings = async (ctx) => {
  const options = {};

  const result = await database.Greeting.findAll(options);
  const greetings = await Promise.all(result.map(greeting => greeting.toJSON()));

  const response = {
    results: greetings,
  };

  ctx.body = response;
};

const createGreeting = async (ctx) => {
  const params = ctx.request.body;

  const greeting = await database.Greeting.create({ message: params.message });

  ctx.body = await greeting.toJSON();
  ctx.status = 201;
};

/** CONFIGURING THE API ROUTES * */

const publicRouter = new Router({ prefix: '/api' });

publicRouter.get('/greetings', listGreetings);
publicRouter.post('/greetings', createGreeting);

app.use(publicRouter.routes());
app.use(publicRouter.allowedMethods());
app.use(serve(path.join(__dirname, 'build/')));
