-- /server/data/initdb.sql
CREATE TABLE IF NOT EXISTS pokemon (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  power INT
);

INSERT INTO pokemon (id, name, power)
VALUES (1, 'bulbasaur', 64)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, power = EXCLUDED.power;