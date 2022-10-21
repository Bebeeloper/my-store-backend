// const { query } = require('express');
const express = require('express');
const routerApi = require('./routes');

const app = express();
const port = 3002;

app.use(express.json()); //middleware

routerApi(app);

// Configure the listen of the port
app.listen(port, () => {
  console.log('Running in port: ' + port);
})
