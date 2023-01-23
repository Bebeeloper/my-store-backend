const pool = require('../libs/postgres.pool');

class OpportunityServices {

  constructor(){
    this.pool = pool;
    this.pool.on('error', (err) => console.error(err));
  }

  // Get all products from DB
  async getAllOpportunities(){
    const query = 'SELECT * FROM opportunities ORDER BY id ASC';
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

  async getOppByDocument(document){
    const query = 'SELECT * FROM opportunities ' +
                  'JOIN accounts ON opportunities.account_id = accounts.id ' +
                  'AND accounts.document_number = $1';
    const array = [document];
    const responseBD = await this.pool.query(query, array);
    let oppBody = [];
    let oppByName;
    for (let i = 0; i < responseBD.rows.length; i++) {
      oppBody.push({
        "id": responseBD.rows[i].id,
        "account_id": responseBD.rows[i].account_id,
        "amount": responseBD.rows[i].amount,
        "stage_name": responseBD.rows[i].stage_name,
        "close_date": responseBD.rows[i].close_date
      });

      const queryAcc = '';
    }

    return oppBody;
  }

}

module.exports = OpportunityServices;
