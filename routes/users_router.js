const express = require('express');
const UsersServices = require('../services/users_services');
const router = express.Router();

const userService = new UsersServices();

router.get('/', async (req, res) => {
  let limit = typeof(req.query.limit) !== 'undefined' ? Number(req.query.limit) : 25;
  const users = await userService.getAllUsers();
  res.json(users.slice(0, limit));
});

// Validate user login 'simulation'
router.get('/:password/:email', async (req, res) => {
  try {
    const { password } = req.params;
    const { email } = req.params;
    const user = await userService.userLogIn(password, email);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }
});

module.exports = router;
