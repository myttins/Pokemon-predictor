const axios = require('axios');
const { pool } = require('./db');

const populateDatabaseWithPokemonData = async () => {
  try {
    // Fetch data from the Pokémon API
    for (let i = 1; i < 31; i++) {
      // check if DB has pokemon
      const existingPokemon = await pool.query(`SELECT * FROM pokemon WHERE id=${i}`);
      if (existingPokemon.rows.length > 0) {
        console.log('Pokemon exists: ', existingPokemon.rows[0].name);
        continue;
      } else {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemon = response.data;
        console.log('Pokemon inserted: ', pokemon.name);
        await pool.query(
          `INSERT INTO pokemon (id, name, power) 
            VALUES ($1, $2, $3)`,
          [i, pokemon.name, pokemon.base_experience],
        );
      }
    }
    console.log('Pokemon populated successfully.');
  } catch (error) {
    console.error('Failed to fetch or insert Pokémon data:', error);
  }
};

module.exports = { populateDatabaseWithPokemonData };
