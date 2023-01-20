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

}

module.exports = OpportunityServices;
