// main.js
import { fetchPokemonData, fetchPokemonList } from './ajax.js';
import {
  showMessage,
  updatePokemonBoxes,
  updateReserveList,
  updateOverlayContent
} from './updateUi.js';

document.addEventListener('DOMContentLoaded', function () {
  const pokemonInput = document.getElementById('pokemonInput');
  const pokemonList = document.getElementById('pokemonList');
  const pokemonDetails = document.getElementById('pokemonDetails');
  const pokemonImage = document.getElementById('pokemonImage');
  const pokemonName = document.getElementById('pokemonName');
  const addToTeamButton = document.getElementById('addToTeamButton');
  const addToReserveButton = document.getElementById('addToReserveButton');
  const overlayContainer = document.getElementById('overlay-container');
  const messageContainer = document.getElementById('messageContainer');
  const nicknameInput = document.getElementById('nicknameInput');
  const myTeamButton = document.getElementById('myTeamButton');
  const addPokemonButton = document.getElementById('addPokemonButton');
  const team = [];
  const reserve = [];

  overlayContainer.style.display = 'none';

  const reserveSection = document.getElementById('reserveSection');
  reserveSection.style.display = 'block';

  function showMessage(message, isError = false, isRemainingPokemonMessage = false) {
    messageContainer.textContent = message;

    if (isError) {
      messageContainer.style.backgroundColor = '#f44336';
      messageContainer.style.color = 'white';
    } else if (isRemainingPokemonMessage) {
      messageContainer.style.backgroundColor = '#333';
      messageContainer.style.color = '#ff9800';
    } else {
      messageContainer.style.backgroundColor = '#4CAF50';
      messageContainer.style.color = 'white';
    }

    messageContainer.style.display = 'block';
    setTimeout(() => {
      messageContainer.style.display = 'none';
    }, 8000);
  }

  function addToReserve() {
    const selectedPokemon = pokemonName.textContent;
    if (selectedPokemon) {
      const selectedPokemonImage = pokemonImage.src;
      const nickname = nicknameInput.value.trim();
      const newPokemon = { name: selectedPokemon, nickname: nickname, image: selectedPokemonImage };
      reserve.push(newPokemon);
      updateReserveList(reserve);
      showOverlay();
    } else {
      showMessage('Please select a Pokémon before adding to reserve.', true);
    }
  }

  function addToTeam() {
    const selectedPokemon = pokemonName.textContent;
    if (selectedPokemon) {
      const selectedPokemonImage = pokemonImage.src;
      const nickname = nicknameInput.value.trim();

      if (team.length < 3) {
        const newPokemon = { name: selectedPokemon, nickname: nickname, image: selectedPokemonImage };
        team.push(newPokemon);
        updatePokemonBoxes(team, overlayContainer);

        overlayContainer.style.display = team.length > 0 ? 'flex' : 'none';

        if (team.length < 3) {
          const remainingPokemon = 3 - team.length;
          showMessage(`Add ${remainingPokemon} more Pokémon to complete your team.`, false, true);
        } else {
          showMessage('Team is full. Remove a Pokémon before adding more.');
        }
      }
      showOverlay(); 
    } else {
      showMessage('Please select a Pokémon before adding to team.', true);
    }
  }

  function handleOverlayContainerClick(event) {
    if (event.target === overlayContainer) {
      overlayContainer.style.display = 'none';

      if (team.length === 0) {
        pokemonDetails.style.display = 'none';
        pokemonInput.value = '';

        const overlay = document.getElementById('overlay');
        overlay.innerHTML = '';

        const reserveSection = document.getElementById('reserveSection');
        reserveSection.style.display = 'block';
      }
    }
  }

  function showOverlay() {
    updateOverlayContent(team, document.getElementById('overlay'));
    overlayContainer.style.display = team.length > 0 ? 'flex' : 'none';
  }

  function hideOverlay() {
    overlayContainer.style.display = 'none';
  }

  addToReserveButton.addEventListener('click', addToReserve);
  addToTeamButton.addEventListener('click', addToTeam);
  document.addEventListener('click', handleOverlayContainerClick);

  fetchPokemonList().then(pokemonNames => {
    pokemonList.innerHTML = pokemonNames.map(name => `<option value="${name}">`).join('');

    pokemonInput.addEventListener('input', function () {
      const selectedPokemon = pokemonInput.value.toLowerCase();
      fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then(pokemonData => {
          if (pokemonData.name) {
            pokemonName.textContent = `Name: ${pokemonData.name}`;

            pokemonImage.src = pokemonData.sprites.front_default;
            pokemonImage.alt = `${pokemonData.name} Image`;
            pokemonImage.style.width = '130px';
            pokemonImage.style.height = '130px';

            pokemonDetails.style.display = 'block';
            showOverlay(); 
          } else {
            showMessage('Invalid Pokémon. Please enter a valid Pokémon name.', true);
          }
        })
        .catch(error => {
          console.error('Error fetching Pokemon data:', error);
          showMessage('Error fetching Pokémon data. Please try again.', true);
        });
    });
  });

  addPokemonButton.addEventListener('click', hideOverlay);
  myTeamButton.addEventListener('click', showOverlay);
});




