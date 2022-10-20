const express = require('express');
const router = express.Router();

const user = {
  userName: 'kmospina',
  password: '123'
};

// Show list of users
router.get('/', (req, res) => {
  res.send('Users list')
});

// Validate user login 'simulation'
router.get('/:userName/:password', (req, res) => {
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

module.exports = router;
