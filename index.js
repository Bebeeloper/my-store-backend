const { query } = require('express');
const express = require('express');
const faker = require('faker');

const app = express();
const port = 3000;

const user = {
  userName: 'kmospina',
  password: '123'
};

//Configure the first route
app.get('/', (req, res) => {
  res.send('Mi primer server con express');
});

// Configuring other endpoint
app.get('/nueva-ruta', (req, res) => {
  res.send('Mi primer endpoint');
});

// Endpoint with hardcode JSON a product object
app.get('/products', (req, res) => {
  res.json([{
    id: '001',
    name: "Carne de cerdo",
    price: 8500
  },
  {
    id: '002',
    name: "Carne de res",
    price: 12500
  }]);
});

// filter specific route should be before to dynamic endpoints like this
app.get('/products/filter', (req, res) => {
  res.send('Soy un specific route');
});

// Get product by id
app.get('/products/:productId', (req, res) => {
  const { productId } = req.params;

  res.json({
    productId,
    name: "Carne",
    price: 8500
  });
});

// Endpoint advanced - show category and product Ids 2 parameters in same endpoint
app.get('/categories/:categoryId/products/:productId', (req, res) => {
  const { categoryId, productId } = req.params;
  res.json({
    categoryId,
    productId
  })
});

// Validate user login 'simulation'
app.get('/users/:userName/:password', (req, res) => {
  const { userName, password } = req.params;
  // res.statusMessage = 'aleluya';
  if (userName == 'kmospina' && password == '123') {
    res.json(user);
    res.status(200);
    res.statusMessage = 'Aleluya';
    console.log(res.statusMessage);
  }else{
    res.send('UserName or password wrong...');
  }
});

// Endpoint queries
app.get('/queries', (req, res) => {
  const { limit, offset } = req.query; //super importante el req

  if (limit && offset) {
    res.json({
      limit,
      offset
    })
  }else {
    res.send('No hay queries en el endpoint');
  }
})

// Configure the listen of the port
app.listen(port, () => {
  console.log('Running in port: ' + port);
})
