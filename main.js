// main.js
import { fetchPokemonData, fetchPokemonList } from './ajax.js';
import {
  showMessage,
  updatePokemonBoxes,
  updateReserveList,
  updateOverlayContent
} from './updateUi.js';

document.addEventListener('DOMContentLoaded', async function () {
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

  try {
    const pokemonNames = await fetchPokemonList();
    pokemonList.innerHTML = pokemonNames.map(name => `<option value="${name}">`).join('');

    pokemonInput.addEventListener('input', async function () {
      const selectedPokemon = pokemonInput.value.toLowerCase();
      try {
        const pokemonData = await fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);

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
      } catch (error) {
        console.error('Can not find Pokemon:', error);
        showMessage('Not a Pokemon. Please try again.', true);
      }
    });
  } catch (error) {
    console.error('Can not find Pokemon:', error);
    showMessage('Not a Pokemon. Please try again.', true);
  }

  addPokemonButton.addEventListener('click', hideOverlay);
  myTeamButton.addEventListener('click', showOverlay);

  addToReserveButton.addEventListener('click', addToReserve);
  addToTeamButton.addEventListener('click', addToTeam);
  document.addEventListener('click', handleOverlayContainerClick);

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
});





