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

      const query = 'SELECT * FROM users WHERE email = $1';
      const array = [body.email];
      const responseDB = await this.pool.query(query, array);

      const hashedPassword = await bcrypt.compare(
        body.password,
        responseDB.rows[0].password
      );

      if (hashedPassword) {
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
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const queryInsertUser = 'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *';
      const arrayInsertUser = [body.email, hashedPassword, body.role];
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
      const query = 'UPDATE users SET password = $1 WHERE id = $2 AND email = $3 RETURNING *';
      const array = [hashedPassword, parseInt(userId), body.email];
      const responseDB = await this.pool.query(query, array);

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
