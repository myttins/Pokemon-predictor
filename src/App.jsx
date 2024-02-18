import axios from 'axios';
import React, { useEffect, useState } from 'react';

const App = () => {
  const [names, setNames] = useState([]);
  const [pokemonOne, setPokemonOne] = useState('');
  const [pokemonTwo, setPokemonTwo] = useState('');
  const [results, setResults] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/pokemon/names');
      setNames(response.data);
    };

    fetchData();
  });

  const handleSubmit = async () => {
  
    if (pokemonOne === '' || pokemonTwo === '') return;
    
    try {
      const params = {
        pokemonOne,
        pokemonTwo,
      };
      
      const response = await axios.get('/api/pokemon/fight', {params});
      setResults(response.data);
    } catch (error) {}
  };

  return (
    <div className='bg-zinc-100 m-10'>
      <h1 className='h1'>POKEMON MATCH PREDICTOR</h1>
      <div className='mt-10 flex'>
        <div className='flex m-5'>
          <p className='mx-4'>Pokemon 1</p>
          <select type='dropdown' defaultValue={'Select Pokemon'} onChange={(e) => setPokemonOne(e.target.value)}>
            <option value={'Select Pokemon'} disabled hidden>
              Select Pokemon
            </option>
            {names.map((i) => (
              <option key={i.id} value={i.name}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex m-5'>
          <p className='mx-4'>Pokemon 2</p>
          <select type='dropdown' onChange={(e) => setPokemonTwo(e.target.value)}>
            <option value={'Select Pokemon'} disabled hidden>
              Select Pokemon
            </option>
            {names.map((i) => (
              <option key={i.id} value={i.name}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <div className='flex m-5'>
          <button className='btn' onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      </div>

      <div className='m-5'>Match Results: {results}</div>
    </div>
  );
};

export default App;
