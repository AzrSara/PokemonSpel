document.addEventListener('DOMContentLoaded', function () {
    const pokemonInput = document.getElementById('pokemonInput');
    const pokemonList = document.getElementById('pokemonList');
    const pokemonDetails = document.getElementById('pokemonDetails');
    const pokemonImage = document.getElementById('pokemonImage');
    const pokemonName = document.getElementById('pokemonName');
    const addToTeamButton = document.getElementById('addToTeamButton');
    const overlayContainer = document.getElementById('overlay-container');
    const messageContainer = document.getElementById('messageContainer');
    const team = [];


    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        messageContainer.classList.toggle('error', isError);
        messageContainer.style.display = 'block';
        setTimeout(() => { messageContainer.style.display = 'none'; }, 5000);
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
                        pokemonImage.style.width = '150px';
                        pokemonImage.style.height = '150px';
                    });
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
                } else {
                    showMessage('Team is full. Remove a Pokémon before adding more.', true);
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
        });
});
