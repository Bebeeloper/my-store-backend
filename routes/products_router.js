const express = require('express');
const router = express.Router();

const products = [{
  id: '001',
  name: "Carne de cerdo",
  price: 8500
},
{
  id: '002',
  name: "Carne de res",
  price: 12500
}];

// GET
// Endpoint with hardcode JSON a product object
router.get('/', (req, res) => {
  res.json(products);
});

// filter specific route should be before to dynamic endpoints like this
router.get('/filter', (req, res) => {
  res.send('Soy un specific route');
});

// Get product by id
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const productById = [];

  for (const product of products) {
    if (productId == product.id) {
      // res.status(200).json(product)
      productById.push(product);
    }else{
      //
    }
  }

  if (productById.length > 0) {
    res.status(200).json(productById);
  }else{
    res.status(404).json({
      message: 'Producto no encontrado',
      productId
    })
  }
  // res.json({
  //   productId,
  //   name: "Carne",
  //   price: 8500
  // });
});

// Endpoint advanced - show category and product Ids 2 parameters in same endpoint
// router.get('/categories/:categoryId/products/:productId', (req, res) => {
//   const { categoryId, productId } = req.params;
//   res.json({
//     categoryId,
//     productId
//   })
// });

// POST
router.post('/',  (req, res) => {
  const body = req.body;
  if (Object.keys(body).length != 0) {
    res.status(201).json({
      message: 'Product created',
      data: body
    })
  }else{
    res.send('Debes poner un body en formato JSON');
  }
});

// PATCH
router.patch('/:productId',  (req, res) => {
  const { productId } = req.params;
  const body = req.body;
  res.json({
    message: 'Product updated',
    data: body,
    productId
  })
});

// DELETE
router.delete('/:productId',  (req, res) => {
  const { productId } = req.params;
  res.json({
    message: 'Product delected',
    productId
  })
});

module.exports = router;
