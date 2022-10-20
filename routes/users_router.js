const express = require('express');
const router = express.Router();

const users = [{
  userName: 'kmospina',
  password: '123'
},{
  userName: 'mmendez',
  password: '321'
},
{
  userName: 'gpardo',
  password: '0000'
},
{
  userName: 'peter',
  password: '123'
}];

// Show list of users
router.get('/', (req, res) => {
  res.send(users)
});

// Validate user login 'simulation'
router.get('/:userName/:password', (req, res) => {
  const usersToShow = [];
  // let logged = false;

  const { userName, password } = req.params;
  // res.send(users[0].userName);

  for (const user of users) {
    if (user.userName == userName && user.password == password) {
      usersToShow.push(user);
    }
  }

  // for (let index = 0; index < users.length; index++) {
  //   if (users[index].userName == userName && users[index].password == password) {
  //     usersToShow.push(users[index]);
  //     logged = true;
  //   }
  // }

  // console.log(logged);
  if (usersToShow.length > 0) {
    res.status(200).json(usersToShow);
  }else{
    res.status(404).json({
      message: 'Passwor or userName wrong...' + ' userName: ' + userName,
    });
  }

});

module.exports = router;
