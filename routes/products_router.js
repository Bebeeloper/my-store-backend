const express = require('express');
const ProductsServices = require('../services/products_services');
const router = express.Router();

const proService = new ProductsServices();

// GET
router.get('/', async (req, res) => {
  const products = await proService.products;
  res.json(products);
});

// filter specific route should be before to dynamic endpoints like this
// router.get('/filter', (req, res) => {
//   res.send('Soy un specific route');
// });

// Get product by id
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await proService.getProductById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
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
router.post('/',  async (req, res) => {
  try {
    const body = req.body;
    const product = await proService.postOneProduct(body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    });
  }

});

// PATCH
router.patch('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const body = req.body;
    const product = await proService.patchOneProduct(productId, body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }

});

// DELETE
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await proService.deleteProduct(productId);
    // if (product.ErrorMessage) return res.status(404).json(product);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }

});

module.exports = router;
