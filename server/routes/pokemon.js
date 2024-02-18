const express = require('express');
const router = express.Router();
const { pool } = require('../data/db');
const { default: axios } = require('axios');

router.get('/names', async (req, res) => {
  const response = await pool.query('SELECT id, name FROM pokemon');
  const pokemonNames = response.rows;
  return res.status(200).json(pokemonNames);
});

router.get('/fight', async (req, res) => {
  try {
    const { pokemonOne, pokemonTwo } = req.query;
    const data1 = await pool.query(`SELECT power FROM pokemon WHERE name = '${pokemonOne}'`);
    const scoreOne = data1.rows[0].power;

    const data2 = await pool.query(`SELECT power FROM pokemon WHERE name = '${pokemonTwo}'`);
    const scoreTwo = data2.rows[0].power;

    if (scoreOne > scoreTwo) {
      return res.status(200).json(`${pokemonOne} wins!`);
    } else if (scoreTwo > scoreOne) {
      return res.status(200).json(`${pokemonTwo} wins!`);
    } else {
      return res.status(200).json(`Its a tie!`);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json('failed');
  }
});

module.exports = router;
