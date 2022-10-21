const express = require('express');
const ProductsServices = require('../services/products_services');
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

const proService = new ProductsServices();
// GET
router.get('/', (req, res) => {
  res.json(proService.products);
});

// filter specific route should be before to dynamic endpoints like this
// router.get('/filter', (req, res) => {
//   res.send('Soy un specific route');
// });

// Get product by id
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const productById = proService.getProductById(productId);
  if (productById) {
    res.status(200).json(productById);
  }else{
    res.status(404).json()
  }
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
    proService.postOneProduct(body);
    res.status(201).json({
      message: 'Product created',
      data: proService.postOneProduct(body)
    });
  }else{
    res.send('Debes poner un body en formato JSON');
  }
});

// PATCH
router.patch('/:productId',  (req, res) => {
  const { productId } = req.params;
  const body = req.body;

  if (proService.patchOneProduct(productId, body) == '') return res.status(404).json({ message: 'Product: ' + productId + ' not found' });
  res.status(200).json(proService.patchOneProduct(productId, body));
});

// DELETE
router.delete('/:productId',  (req, res) => {
  const { productId } = req.params;
  const product = products.find(product => product.id === productId);

  const productIndex = products.indexOf(product);

  if (!product) res.status(404).json({ message: 'Product: ' + productId + ' not found' });

  products.splice(productIndex, 1);

  res.status(200).json({
    message: 'Producto eliminado correctamente',
    product
  });

});

module.exports = router;
