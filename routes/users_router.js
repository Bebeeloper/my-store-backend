const express = require('express');
const UsersServices = require('../services/users_services');
const router = express.Router();

const userService = new UsersServices();

router.get('/', async (req, res) => {
  let limit = typeof(req.query.limit) !== 'undefined' ? Number(req.query.limit) : 25;
  const users = await userService.getAllUsers();
  res.json(users.slice(0, limit));
});

// Validate user login
router.post('/login', async (req, res) => {
  try {
    const body = req.body;
    const user = await userService.userLogIn(body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }
});

// POST User
router.post('/',  async (req, res) => {
  try {
    const body = req.body;
    const user = await userService.postUser(body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    });
  }

});

// PATCH Password User
router.patch('/password/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const body = req.body;
    const user = await userService.patchUserPassword(userId, body);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      ErrorMessage: error.message
    })
  }
});

module.exports = router;
