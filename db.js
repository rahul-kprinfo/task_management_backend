const { Pool } = require('pg');


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "userAuthentication",
  password: "rahul",
  port: 5432,
});

module.exports = pool;
