const express = require('express');
const productsRouter = require('./products_router');
const usersRouter = require('./users_router');
const opportunitiesRouter = require('./opportunities_router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/users', usersRouter);
  router.use('/opportunities', opportunitiesRouter);
}

module.exports = routerApi;
