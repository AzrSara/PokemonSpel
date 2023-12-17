//hämtar data från API asynchron
export function fetchPokemonData(url) {
	return fetch(url)
	  .then(response => response.json())
	  .catch(error => console.error('Error fetching Pokemon data:', error));
  }
  
  export function fetchPokemonList() {
	return fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
	  .then(response => response.json())
	  .then(data => data.results.map(pokemon => pokemon.name).sort());
  }
  