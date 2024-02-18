const request = require('supertest');
const express = require('express');
const pokemonRoutes = require('../server/routes/pokemon');

const app = express();
app.use(express.json());
app.use('/api/pokemon', pokemonRoutes);

// Mock the pool module used in your routes
jest.mock('../server/data/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { pool } = require('../server/data/db');

describe('Pokemon API Routes', () => {
  describe('GET /api/pokemon/names', () => {
    it('should return a list of pokemon names', async () => {
      const mockData = {
        rows: [
          { id: 1, name: 'Bulbasaur' },
          { id: 2, name: 'Ivysaur' },
        ],
      };
      pool.query.mockResolvedValue(mockData);

      const response = await request(app).get('/api/pokemon/names');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockData.rows);
      expect(pool.query).toHaveBeenCalledWith('SELECT id, name FROM pokemon');
    });
  });

  describe('GET /api/pokemon/fight', () => {
    it('should declare the correct pokemon as winner based on power', async () => {
      pool.query.mockImplementation((query) => {
        if (query.includes("'Pikachu'")) {
          return Promise.resolve({ rows: [{ power: 50 }] });
        } else if (query.includes("'Charmander'")) {
          return Promise.resolve({ rows: [{ power: 30 }] });
        }
        throw new Error('Query not handled in the mock');
      });

      const response = await request(app).get('/api/pokemon/fight?pokemonOne=Pikachu&pokemonTwo=Charmander');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Pikachu wins!');
    });

    it('should return a tie if both pokemon have equal power', async () => {
      pool.query.mockResolvedValue({ rows: [{ power: 40 }] }); // Simulate equal power for both

      const response = await request(app).get('/api/pokemon/fight?pokemonOne=Squirtle&pokemonTwo=Bulbasaur');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Its a tie!');
    });

    it('should handle errors gracefully', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/pokemon/fight?pokemonOne=MissingNo&pokemonTwo=Glitch');
      expect(response.statusCode).toBe(400);
      expect(response.text).toContain('failed');
    });
  });
});
