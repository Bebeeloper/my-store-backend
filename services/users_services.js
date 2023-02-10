const pool = require('../libs/postgres.pool');
const bcrypt = require('bcrypt');

class UserServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // get all users
  async getAllUsers(){
    const query = 'SELECT * FROM users ORDER BY id DESC';
    const responseDB = await this.pool.query(query);

    if (responseDB.rows.length > 0) {
      return responseDB.rows
    }
  }

  // user login
  async userLogIn(body){
    if (Object.keys(body).length != 0) {
      const query = 'SELECT * FROM users WHERE password = crypt($1, password) AND email = $2';
      const array = [body.password, body.email];
      const responseDB = await this.pool.query(query, array);

      if (responseDB.rows.length > 0) {
        return {
          message: 'User logged in successfully',
          data: responseDB.rows
        }
      }else{
        throw new Error('User not found');
      }
    }else{
      throw new Error('Debes poner un body en formato JSON');
    }
  }

  async postUser(body){
    if (Object.keys(body).length != 0) {
      const queryInsertUser = 'INSERT INTO users (email, password, role) VALUES ($1, crypt($2, gen_salt(\'bf\')), $3) RETURNING *';
      const arrayInsertUser = [body.email, body.password, body.role];
      const responseDB = await this.pool.query(queryInsertUser, arrayInsertUser);

      if (responseDB.rows.length > 0) {
        return {
          message: 'User created successfully',
          data: responseDB.rows
        }
      }else{
        throw new Error('No se pudo insertar el usuario en la Base de datos');
      }

    }else{
      throw new Error('Debes poner un body en formato JSON');
    }
  }

  async patchUserPassword(userId, body){
    const getDBUser = await this.getDBById(userId);
    let userArray = getDBUser;
    // console.log(getDBUser);
    let userFind = userArray.find(user => user.id === parseInt(userId));

    const fieldsToUpdate = {
      ...userFind,
      ...body
    };
    console.log(fieldsToUpdate);
    const hashedPassword = await bcrypt.hash(fieldsToUpdate.password, 10);

    if (getDBUser.length > 0) {
      const query = 'UPDATE users SET password = ahorasi WHERE id = 6';
      // const array = [hashedPassword, parseInt(userId)];
      const responseDB = await this.pool.query(query);

      console.log(responseDB.rows);

      if (responseDB.rows.length > 0) {
        return {
          Message: 'User updated successfully',
          data: fieldsToUpdate
        };
      }else{
        throw new Error('We can not change user password, try again');
      }
    }else{
      throw new Error('User: ' + userId + ' not found');
    }

  }

  async getDBById(userId){
    const query = 'SELECT id, email, password, role FROM users WHERE id = $1';
    const array = [parseInt(userId)];
    const responseDB = await this.pool.query(query, array);
    return responseDB.rows;
  }

}

module.exports = UserServices;
