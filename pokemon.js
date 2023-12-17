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
    const team = [];
    const reserve = [];

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

    function fetchPokemonData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.error('Error fetching Pokemon data:', error));
    }

    function updatePokemonBoxes() {
        const pokemonBoxes = document.querySelectorAll('.pokemon-box');
        const overlayContainer = document.getElementById('overlay-container');

        pokemonBoxes.forEach((box, index) => {
            if (index < team.length) {
                const { name, nickname, image } = team[index];
                box.innerHTML = `<p>${nickname ? `${nickname} (${name})` : name}</p><img src="${image}" alt="${name} Image">`;
            } else {
                box.innerHTML = '';
            }
        });

        overlayContainer.style.display = team.length > 0 ? 'flex' : 'none';
        if (team.length > 0) {
            updateOverlayContent();
        }
    }

    function updateReserveList() {
        reserveList.innerHTML = '';

        reserve.forEach((pokemon, index) => {
            const pokemonBox = document.createElement('div');
            pokemonBox.classList.add('pokemon-box-overlay');

            pokemonBox.innerHTML = `<p>${pokemon.nickname ? `${pokemon.nickname} (${pokemon.name})` : pokemon.name}</p>
                                <img src="${pokemon.image}" alt="${pokemon.name} Image">`;

            pokemonBox.addEventListener('click', () => {
                reserve.splice(index, 1);
                updateReserveList();
            });

            reserveList.appendChild(pokemonBox);
        });
    }

    function updateOverlayContent() {
        const overlay = document.getElementById('overlay');
        overlay.innerHTML = '';

        team.forEach((pokemon, index) => {
            const pokemonBox = document.createElement('div');
            pokemonBox.classList.add('pokemon-box-overlay');

            pokemonBox.innerHTML = `<p>${pokemon.nickname ? `${pokemon.nickname} (${pokemon.name})` : pokemon.name}</p>
                                <img src="${pokemon.image}" alt="${pokemon.name} Image">`;

            pokemonBox.addEventListener('click', () => {
                team.splice(index, 1);
                updatePokemonBoxes();
            });

            overlay.appendChild(pokemonBox);
        });
    }

    addToReserveButton.addEventListener('click', function () {
        const selectedPokemon = pokemonName.textContent;
        const selectedPokemonImage = pokemonImage.src;
        const nickname = nicknameInput.value.trim();

        const newPokemon = { name: selectedPokemon, nickname: nickname, image: selectedPokemonImage };
        reserve.push(newPokemon);
        updateReserveList();
    });

    addToTeamButton.addEventListener('click', function () {
        const selectedPokemon = pokemonName.textContent;
        const selectedPokemonImage = pokemonImage.src;
        const nickname = nicknameInput.value.trim();

        if (team.length < 3) {
            const newPokemon = { name: selectedPokemon, nickname: nickname, image: selectedPokemonImage };
            team.push(newPokemon);
            updatePokemonBoxes();

            overlayContainer.style.display = team.length > 0 ? 'flex' : 'none';

            if (team.length < 3) {
                const remainingPokemon = 3 - team.length;
                showMessage(`Add ${remainingPokemon} more Pokémon to complete your team.`, false, true);
            } else {
                showMessage('Team is full. Remove a Pokémon before adding more.');
            }
        }
    });

    document.addEventListener('click', event => {
        if (event.target === overlayContainer) {
            overlayContainer.style.display = 'none';
            if (team.length === 0) {
                pokemonDetails.style.display = 'none';
            }
        }
    });

    fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(data => {
            const pokemonNames = data.results.map(pokemon => pokemon.name).sort();
            pokemonList.innerHTML = pokemonNames.map(name => `<option value="${name}">`).join('');

            pokemonInput.addEventListener('input', function () {
                const selectedPokemon = pokemonInput.value.toLowerCase();
                fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
                    .then(pokemonData => {
                        pokemonName.textContent = `Name: ${pokemonData.name}`;

                        pokemonImage.src = pokemonData.sprites.front_default;
                        pokemonImage.alt = `${pokemonData.name} Image`;
                        pokemonImage.style.width = '130px';
                        pokemonImage.style.height = '130px';
                    });
            });
        });
});


  


