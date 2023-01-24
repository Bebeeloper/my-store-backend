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
    const query = 'SELECT opportunities.id, opportunities.account_id,' +
                         'opportunities.amount, opportunities.stage_name,' +
                         'opportunities.close_date FROM opportunities ' +
                  'JOIN accounts ON opportunities.account_id = accounts.id ' +
                  'AND accounts.document_number = $1';
    const array = [document];
    const responseBD = await this.pool.query(query, array);
    let oppByName = [];

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
  }

}

module.exports = OpportunityServices;
