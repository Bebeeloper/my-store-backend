const pool = require('../libs/postgres.pool');

class AccountsServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // Get all products from DB
  async getAllAccounts(){
    const query = 'SELECT * FROM accounts ORDER BY id DESC';
    const responseDB = await this.pool.query(query);
    return responseDB.rows;
  }

  // Get account by document
  async getAccByDocument(document){
    const queryAcc = 'SELECT * FROM accounts WHERE document_number = $1';
    const arrayAcc = [document];
    const responseDB = await this.pool.query(queryAcc, arrayAcc);

    if (responseDB.rows.length > 0) {
      return responseDB.rows;
    }else{
      throw new Error('No hay una cuenta creada con el siguiente documento: ' + document);
    }
  }

  // Post account
  async postAccount(body){
    if (Object.keys(body).length != 0) {
      const queryInsertAcc = 'INSERT INTO accounts (first_name, last_name, document_number, email) VALUES ($1, $2, $3, $4) RETURNING *';
      const arrayInsertAcc = [body.first_name, body.last_name, body.document_number, body.email];
      const responseDB = await this.pool.query(queryInsertAcc, arrayInsertAcc);

      if (responseDB.rows.length > 0) {
        return {
          message: 'Account created successfully',
          data: responseDB.rows
        }
      }
    }else{
      throw new Error('Debes poner un body en formato JSON');
    }
  }

  // Patch account
  async patchAccount(accId, body){
    const getDBAcc = await this.getDBById(accId);
    let accArray = getDBAcc;
    let accFind = accArray.find(acc => acc.id === parseInt(accId));

    const fieldsToUpdate = {
      ...accFind,
      ...body
    };

    if (accFind) {
      const query = 'UPDATE accounts SET first_name = $1, last_name = $2, document_number = $3, email = $4 WHERE id = $5';
      const array = [fieldsToUpdate.first_name, fieldsToUpdate.last_name, fieldsToUpdate.document_number, fieldsToUpdate.email, parseInt(accId)];
      const responseDB = await this.pool.query(query, array);

      return {
        Message: 'Account updated successfully',
        data: fieldsToUpdate
      };
    }else{
      throw new Error('Account: ' + accId + ' not found');
    }

  }

  // Delete account
  async deleteAccount(accId){
    const getDBAcc = await this.getDBById(accId);
    if (getDBAcc.length > 0) {
      const query = 'DELETE FROM accounts WHERE id = $1';
      const array = [parseInt(accId)];
      const responseDelete = await this.pool.query(query, array);
      return {
        Message: 'Account ' + accId + ' has been eliminated successfully',
        data:  getDBAcc
      };

    }else{
      throw new Error('Account: ' + accId + ' not found');
    }
  }

  async getDBById(productId){
    const query = 'SELECT * FROM accounts WHERE id = $1';
    const array = [parseInt(productId)];
    const responseDB = await this.pool.query(query, array);
    return responseDB.rows;
  }

}

module.exports = AccountsServices;
