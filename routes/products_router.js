const express = require('express');
const router = express.Router();

// Endpoint with hardcode JSON a product object
router.get('/', (req, res) => {
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
router.get('/filter', (req, res) => {
  res.send('Soy un specific route');
});

// Get product by id
router.get('/:productId', (req, res) => {
  const { productId } = req.params;

  res.json({
    productId,
    name: "Carne",
    price: 8500
  });
});

// Endpoint advanced - show category and product Ids 2 parameters in same endpoint
// router.get('/categories/:categoryId/products/:productId', (req, res) => {
//   const { categoryId, productId } = req.params;
//   res.json({
//     categoryId,
//     productId
//   })
// });

module.exports = router;
