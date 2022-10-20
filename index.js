const { query } = require('express');
const express = require('express');
const faker = require('faker');
const routerApi = require('./routes');

const app = express();
const port = 3000;

routerApi(app);

// Configure the listen of the port
app.listen(port, () => {
  console.log('Running in port: ' + port);
})
