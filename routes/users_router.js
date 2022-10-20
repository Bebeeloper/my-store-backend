const express = require('express');
const router = express.Router();

const users = [{
  userName: 'kmospina',
  password: '123'
},{
  userName: 'mmendez',
  password: '321'
}];

// Show list of users
router.get('/', (req, res) => {
  res.send(users)
});

// Validate user login 'simulation'
router.get('/:userName/:password', (req, res) => {
  const usersToShow = [];
  let logged = false;

  const { userName, password } = req.params;
  // res.send(users[0].userName);

  for (let index = 0; index < users.length; index++) {
    if (users[index].userName == userName && users[index].password == password) {
      usersToShow.push(users[index]);
      logged = true;
    }
  }

  console.log(logged);
  if (logged) {
    return res.json(usersToShow);
  }else{
    return res.send('Passwor or userName wrong');
  }

});

module.exports = router;
