// ajax.js
export async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

export async function fetchPokemonList() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    return data.results.map(pokemon => pokemon.name).sort();
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

  

  
  