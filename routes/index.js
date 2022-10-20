const productsRouter = require('./products_router');
const usersRouter = require('./users_router');

const apiVersion = '/api/v2';

function routerApi(app) {
  app.use(apiVersion + '/products', productsRouter);
  app.use(apiVersion + '/users', usersRouter);
}

module.exports = routerApi;
