// /server/data/db.js
require('dotenv').config('../../.env'); // Ensure this is at the top to load environment variables
const { Pool } = require('pg');

const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
const dbHost = isRunningInDocker ? 'db' : 'localhost';

const dbConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      user: 'username',
      host: dbHost,
      database: 'mydb',
      password: 'password',
      port: 5432,
    };

console.log(process.env)

const pool = new Pool(dbConfig);
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
    console.log('failled at initializedb');
  }
};

module.exports = { pool, initializedb };
