document.addEventListener('DOMContentLoaded', function () {
    const pokemonInput = document.getElementById('pokemonInput');
    const pokemonList = document.getElementById('pokemonList');
    const pokemonDetails = document.getElementById('pokemonDetails');
    const pokemonImage = document.getElementById('pokemonImage');
    const pokemonName = document.getElementById('pokemonName');
    const addToTeamButton = document.getElementById('addToTeamButton');
    const overlayContainer = document.getElementById('overlay-container');
    const pokemonBoxes = document.querySelectorAll('.pokemon-box');
    const nicknameInput = document.getElementById('nicknameInput');
  
    const team = []; // Array för att lagra Pokémon i laget
  
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(response => response.json())
      .then(data => {
        const pokemonNames = data.results.map(pokemon => pokemon.name).sort();
        pokemonNames.forEach(name => pokemonList.innerHTML += `<option value="${name}">`);
  
        pokemonInput.addEventListener('input', function () {
          const selectedPokemon = pokemonInput.value.toLowerCase();
          fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
            .then(response => response.json())
            .then(pokemonData => {
              pokemonName.textContent = `Name: ${pokemonData.name}`;
              pokemonImage.src = pokemonData.sprites.front_default;
              pokemonImage.alt = `${pokemonData.name} Image`;
            })
            .catch(error => console.error('Error fetching Pokemon details:', error));
        });
  
        addToTeamButton.addEventListener('click', function () {
          const selectedPokemon = pokemonName.textContent;
          const selectedPokemonImage = pokemonImage.src;
          const nickname = nicknameInput.value.trim();
  
          if (team.length < 3) {
            const newPokemon = { name: selectedPokemon, nickname: nickname, image: selectedPokemonImage };
            team.push(newPokemon);
  
            // Uppdatera Pokemon-boxarna
            updatePokemonBoxes();
  
            // Återställ input för smeknamn
            nicknameInput.value = '';
          } else {
            alert('Team is full. Remove a Pokémon before adding more.');
          }
        });
  
        // Lägg till händelselyssnare för att ta bort Pokemon från laget
        pokemonBoxes.forEach((box, index) => {
          box.addEventListener('click', function () {
            if (index < team.length) {
              team.splice(index, 1); // Ta bort Pokemon från laget
              updatePokemonBoxes(); // Uppdatera Pokemon-boxarna
            }
          });
        });
  
        overlayContainer.addEventListener('click', event => {
          if (event.target === overlayContainer) {
            overlayContainer.style.display = 'none';
            if (team.length === 0) {
              pokemonDetails.style.display = 'none'; // Dölj även detaljsektionen om laget är tomt
            }
          }
        });
      })
      .catch(error => console.error('Error fetching Pokemon data:', error));
  
    // Uppdatera Pokemon-boxarna med aktuella laget
    function updatePokemonBoxes() {
      pokemonBoxes.forEach((box, index) => {
        if (index < team.length) {
          const { name, nickname, image } = team[index];
          box.innerHTML = `<p>${nickname ? `${nickname} (${name})` : name}</p><img src="${image}" alt="${name} Image">`;
        } else {
          box.innerHTML = '';
        }
      });
  
      // Visa overlayen och Pokemon-boxarna när användaren lägger till eller tar bort en Pokemon i laget
      overlayContainer.style.display = team.length > 0 ? 'flex' : 'none';
  
      // Visa detaljsektionen om laget inte är tomt
      pokemonDetails.style.display = team.length > 0 ? 'block' : 'none';
    }
  });
  
  
  
  

  
  
  

  
  
  
  
  
  
  