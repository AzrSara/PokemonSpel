document.querySelector("#search").addEventListener("click", getPokemon);
document.querySelector("#pokemonName").addEventListener("input", searchPokemon);

const selectedPokemon = [];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseName(string) {
  return string.toLowerCase();
}

function getPokemon(e) {
  const name = document.querySelector("#pokemonName").value;
  const pokemonName = lowerCaseName(name);

  fetchPokemon(pokemonName);
  e.preventDefault();
}

function searchPokemon() {
  const searchInput = document.querySelector("#pokemonName").value;
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.results.map((pokemon) => pokemon.name);
      displaySuggestions(pokemonList, searchInput);
    })
    .catch((err) => {
      console.log("Error fetching Pokemon list", err);
    });
}

function displaySuggestions(suggestions, searchInput) {
  const suggestionsContainer = document.querySelector(".suggestions");
  suggestionsContainer.innerHTML = "";

  suggestions
    .filter((pokemon) => pokemon.startsWith(searchInput.toLowerCase()))
    .sort() // Sort suggestions alphabetically
    .forEach((pokemon) => {
      const suggestionElement = document.createElement("div");
      suggestionElement.innerText = capitalizeFirstLetter(pokemon);
      suggestionElement.addEventListener("click", () => {
        fetchPokemon(pokemon);
      });
      suggestionsContainer.appendChild(suggestionElement);
    });
}

function fetchPokemon(pokemonName) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
      document.querySelector(".pokemonBox").innerHTML = `
        <div>
          <img
            src="${data.sprites.other["official-artwork"].front_default}"
            alt="Pokemon"
          />
          <p>${capitalizeFirstLetter(data.name)}</p>
        </div>`;

      selectedPokemon.push(data);
      updateTeam();
    })
    .catch(() => {
      document.querySelector(".pokemonBox").innerHTML = `
        <h4>Pokemon not found 😞</h4>
      `;
    });
}

function updateTeam() {
  const teamContainer = document.querySelector(".team");
  teamContainer.innerHTML = "";

  for (let i = 0; i < Math.min(selectedPokemon.length, 3); i++) {
    const pokemon = selectedPokemon[i];
    const pokemonElement = document.createElement("div");
    pokemonElement.innerHTML = `
      <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Pokemon">
      <p>${capitalizeFirstLetter(pokemon.name)}</p>
    `;
    teamContainer.appendChild(pokemonElement);
  }
}



