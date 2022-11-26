// const { query } = require('express');
const express = require('express');
const routerApi = require('./routes');
const cors = require('cors');

const app = express();
const port = 3002;

var whitelist = ['http://localhost:3000']; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

app.use(cors(corsOptions));

// app.use(cors())
app.use(express.json()); //middleware



routerApi(app);

// Configure the listen of the port
app.listen(port, () => {
  console.log('Running in port: ' + port);
})
