// /server/data/db.js
require('dotenv').config(); // Ensure this is at the top to load environment variables
const { Pool } = require('pg');

const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';

const pool = new Pool({
  user: 'username',
  // host: isRunningInDocker ? 'db' : 'localhost',
  host: 'db',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

const initializedb = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS pokemon (
      id INT PRIMARY KEY,
      name VARCHAR(100),
      power INT
    );`);

    await pool.query(`INSERT INTO pokemon (id, name, power)
    VALUES (1, 'bulbasaur', 64)
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, power = EXCLUDED.power;`);

  } catch (error) {
    console.log('failled at initizliedb');
  }
};

async function printAllTables() {
  try {
    const query = `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE' AND
      table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `;
    const { rows } = await pool.query(query);
    console.log('Tables in the database:');
    rows.forEach((row) => console.log(`${row.table_schema}.${row.table_name}`));
  } catch (err) {
    console.error('Error listing tables:', err);
  }
}

module.exports = { pool, printAllTables, initializedb };
