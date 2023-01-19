const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'opra',
  password: 'opra2023',
  database: 'my_store'
});

module.exports = pool;

