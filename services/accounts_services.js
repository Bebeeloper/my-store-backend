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

}

module.exports = AccountsServices;
