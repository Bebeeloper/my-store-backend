const pool = require('../libs/postgres.pool');

class UserServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  async getAllUsers(){
    const query = 'SELECT * FROM users ORDER BY id DESC';
    const responseDB = await this.pool.query(query);
    // let opportunitiesWithAccounts = [];

    if (responseDB.rows.length > 0) {
      return responseDB.rows
    }
  }

  async userLogIn(password, email){
    const query = 'SELECT * FROM users WHERE password = crypt($1, password) AND email = $2';
    const array = [password, email];
    const responseDB = await this.pool.query(query, array);
    if (responseDB.rows.length > 0) {
      return {
        message: 'User logged in successfully',
        data: responseDB.rows
      }
    }else{
      throw new Error('User not found');
    }
  }

}

module.exports = UserServices;
