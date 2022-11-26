const express = require('express');
const ProductsServices = require('../services/products_services');
const router = express.Router();

const proService = new ProductsServices();

// GET
router.get('/', (req, res) => {
  res.json(proService.products);
});

// filter specific route should be before to dynamic endpoints like this
// router.get('/filter', (req, res) => {
//   res.send('Soy un specific route');
// });

// Get product by name
router.get('/name/:productName', (req, res) => {
  const { productName } = req.params;
  const product = proService.getProductByName(productName);

  if (product.ErrorMessage) return res.status(404).json(product);
  res.status(200).json(product);
});

// Get product by id
router.get('/:productId', (req, res) => {
  const { productId } = req.params;
  const product = proService.getProductById(productId);

  if (product.ErrorMessage) return res.status(404).json(product);
  res.status(200).json(product);
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
  const product = proService.postOneProduct(body);

  if (product.ErrorMessage) return res.status(404).json(product);
  res.status(200).json(product);
});

// PATCH
router.patch('/:productId',  (req, res) => {
  const { productId } = req.params;
  const body = req.body;
  const product = proService.patchOneProduct(productId, body);

  if (product.ErrorMessage) return res.status(404).json(product);
  res.status(200).json(product);
});

// DELETE
router.delete('/:productId',  (req, res) => {
  const { productId } = req.params;
  const product = proService.deleteProduct(productId);
  if (product.ErrorMessage) return res.status(404).json(product);
  res.status(200).json(product);
});

module.exports = router;
