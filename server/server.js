// server/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pokemon = require('./routes/pokemon');

const app = express();
app.use(express.json());
app.use(cors());

const { pool, printAllTables, initializedb } = require('./data/db');
const { populateDatabaseWithPokemonData } = require('./data/retrieveData');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.use(express.static(path.join(__dirname, '../build')));
app.use('/api/pokemon', pokemon);

app.get('/api/healthcheck', (req, res) => {
  return res.sendStatus(200);
});

// Serve the React application
app.get('*', (_req, res) => {
  return res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.use((_req, res) => {
  return res.status(404).json({ message: 'API route not found.' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
});

// const { initializeScheduledJobs } = require('./schedulers/paymentScheduler');

const PORT = parseInt(process.env.PORT) || 3000;

// const printdb = async () => {
//   const { rows } = await pool.query('SELECT * FROM pokemon');
//   console.log(res.json(rows));
// };

const waitForDb = async (maxRetries = 5, interval = 2000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await pool.query('SELECT 1'); // Simple query to check if the DB is ready
      console.log('Database connection established.');
      return;
    } catch (error) {
      console.error(`Waiting for database to be ready... Attempt ${attempt} of ${maxRetries}`);
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      } else {
        throw new Error('Failed to connect to the database after several attempts.');
      }
    }
  }
};

const startServer = async () => {
  try {
    // Initialize DB
    await initializedb();
    console.log('Database initialized successfully.');
    await populateDatabaseWithPokemonData();
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
      if (process.env.NODE_ENV === 'development') {
        console.log('Running in development mode');
      } else if (process.env.NODE_ENV === 'production') {
        console.log('Running in production mode');
      }
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit if database initialization fails
  }
};

startServer();
