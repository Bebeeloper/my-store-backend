const pool = require('../libs/postgres.pool');

class OpportunityServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // Get all products from DB
  async getAllOpportunities(){
    const query = 'SELECT * FROM opportunities ORDER BY id DESC';
    const responseDB = await this.pool.query(query);
    let opportunitiesWithAccounts = [];

    for (let index = 0; index < responseDB.rows.length; index++) {
      // Related account query
      const queryRelatedAccount = 'SELECT * FROM accounts WHERE id = $1';
      const arrayRelatedAccount = [responseDB.rows[index].account_id];
      const responseRelatedAccount = await this.pool.query(queryRelatedAccount, arrayRelatedAccount);

      // Opportunity line items query
      const queryRelatedOLI = 'SELECT * FROM opportunity_line_items WHERE opp_id = $1';
      const arrayRelatedOLI = [responseDB.rows[index].id];
      const responseRelatedOLI = await this.pool.query(queryRelatedOLI, arrayRelatedOLI);

      opportunitiesWithAccounts.push({
        ...responseDB.rows[index],
        Account: responseRelatedAccount.rows,
        OpportunityLineItems: responseRelatedOLI.rows
      })
    }

    return opportunitiesWithAccounts;
  }

  // Get opp by account document
  async getOppByDocument(document){
    const query = 'SELECT opportunities.id, opportunities.account_id,' +
                         'opportunities.amount, opportunities.stage_name,' +
                         'opportunities.close_date FROM opportunities ' +
                  'JOIN accounts ON opportunities.account_id = accounts.id ' +
                  'AND accounts.document_number = $1';
    const array = [document];
    const responseBD = await this.pool.query(query, array);
    let oppByName = [];

    if (responseBD.rows.length > 0) {
      for (let i = 0; i < responseBD.rows.length; i++) {
        let oppBody = {
          "id": responseBD.rows[i].id,
          "account_id": responseBD.rows[i].account_id,
          "amount": responseBD.rows[i].amount,
          "stage_name": responseBD.rows[i].stage_name,
          "close_date": responseBD.rows[i].close_date
        };

        // Get related account
        const queryAcc = 'SELECT * FROM accounts WHERE id = $1';
        const arrayAcc = [responseBD.rows[0].account_id];
        const responseAcc = await this.pool.query(queryAcc, arrayAcc);

        // Get related OLI
        const queryRelatedOLI = 'SELECT * FROM opportunity_line_items WHERE opp_id = $1';
        const arrayRelatedOLI = [responseBD.rows[i].id];
        const responseRelatedOLI = await this.pool.query(queryRelatedOLI, arrayRelatedOLI);

        oppByName.push({
          ...oppBody,
          Account: responseAcc.rows,
          OpportunityLineItems: responseRelatedOLI.rows
        });
      }

      return oppByName;
    }else{
      throw new Error('El cliente ' + document + ' no ha realizado compras aún');
    }
  }

  // Create opp
  async postOpp(body){
    if (Object.keys(body).length != 0) {
      const queryInsertOpp = 'INSERT INTO opportunities (account_id, amount, stage_name, close_date) VALUES ($1, $2, $3, $4) RETURNING *';
      const arrayInsertOpp = [body.account_id, body.amount, body.stage_name, body.close_date];
      const responseDB = await this.pool.query(queryInsertOpp, arrayInsertOpp);

      if (responseDB.rows.length > 0) {
        return {
          message: 'Opportunity created successfully',
          data: responseDB.rows
        }
      }
    }else{
      throw new Error('Debes poner un body en formato JSON');
    }
  }

  async patchOpp(oppId, body){
    const getDBOpp = await this.getDBById(oppId);
    let oppArray = getDBOpp;
    let oppFind = oppArray.find(opp => opp.id === parseInt(oppId));

    const fieldsToUpdate = {
      ...oppFind,
      ...body
    };

    if (oppFind) {
      const query = 'UPDATE opportunities SET account_id = $1, amount = $2, stage_name = $3, close_date = $4 WHERE id = $5';
      const array = [fieldsToUpdate.account_id, fieldsToUpdate.amount, fieldsToUpdate.stage_name, fieldsToUpdate.close_date, parseInt(oppId)];
      const responseDB = await this.pool.query(query, array);

      return {
        Message: 'Opportunity updated successfully',
        data: fieldsToUpdate
      };
    }else{
      throw new Error('Opportunity: ' + oppId + ' not found');
    }

  }

  async deleteOpp(oppId){
    const getDBOpp = await this.getDBById(oppId);
    if (getDBOpp.length > 0) {
      const query = 'DELETE FROM opportunities WHERE id = $1';
      const array = [parseInt(oppId)];
      const responseDelete = await this.pool.query(query, array);
      return {
        Message: 'Opportunity ' + oppId + ' has been eliminated successfully',
        data:  getDBOpp
      };

    }else{
      throw new Error('Opportunity: ' + oppId + ' not found');
    }
  }

  async getDBById(oppId){
    const query = 'SELECT * FROM opportunities WHERE id = $1';
    const array = [parseInt(oppId)];
    const responseDB = await this.pool.query(query, array);
    return responseDB.rows;
  }

}

module.exports = OpportunityServices;
