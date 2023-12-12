// Create fetchData function to fetch the data from the Pokemon API
function fetchData(url) {
    return fetch(url).then(response => response.json());
}

// Create addPokemonToDOM to add the Pokemon to select DOM element
function addPokemonToDOM(pokemon, selectEl, content1, overlay) {
    let output = ""; // Initialize output as an empty string
    pokemon.results.forEach(singlePokemon => {
        output += `
        <option value="${singlePokemon.name}">${singlePokemon.name}</option>
        `;
    });
    selectEl.innerHTML = output;

    // Add event listener for the change of the selected options
    selectEl.addEventListener('change', event => {
        fetchData('https://pokeapi.co/api/v2/pokemon?limit=151').then(
            pokemonData => {
                pokemonData.results.forEach(result => {
                    if (event.target.value === result.name) {
                        const pokemonURL = result.url;
                        fetchData(pokemonURL).then(data => {
                            console.log(data);
                            const imagesData = data.sprites.other.dream_world.front_default;
                            image.src = imagesData;

                            // Update content1 to display the selected Pokemon in a dark transparent box
                            content1.innerHTML = `
                                <div class="dark-box">
                                    <img src="${imagesData}" alt="${result.name}">
                                    <p>${result.name}</p>
                                </div>
                            `;

                            // Show the overlay when a Pokemon is selected
                            overlay.style.display = 'flex';
                        });
                    }
                });
            },
        );
    });
}

// Create the main function that contains the DOM elements and executes the fetch data and adds elements to the DOM
function main() {
    // Needed DOM elements: button, select, and options (will be added inside the

    // 1. Creating DOM elements
    const container = document.createElement('div');
    const button = document.createElement('button');
    const selectEl = document.createElement('select');
    const image = document.createElement('img');
    const content1 = document.createElement('div');
    const overlay = createOverlay(); // Added overlay creation

    // 2. Appending DOM elements to the document body
    document.body.appendChild(container);

    container.appendChild(button);
    container.appendChild(selectEl);
    container.appendChild(content1);

     // Add event listener for click event of the button
	 button.addEventListener('click', () => {
        fetchData('https://pokeapi.co/api/v2/pokemon?limit=151').then(
            pokemonData => {
                addPokemonToDOM(pokemonData, selectEl, content1, overlay);
            },
        );
    });

    // Add event listener for the change of the selected options
    selectEl.addEventListener('change', event => {
        fetchData('https://pokeapi.co/api/v2/pokemon?limit=151').then(
            pokemonData => {
                pokemonData.results.forEach(result => {
                    if (event.target.value === result.name) {
                        const pokemonURL = result.url;
                        fetchData(pokemonURL).then(data => {
                            console.log(data);
                            const imagesData = data.sprites.other.dream_world.front_default;
                            image.src = imagesData;
                            content1.innerHTML = ""; // Clear previous content
                            content1.appendChild(image);

                            // Add a button to add the selected Pokemon to the overlay
                            const addToOverlayButton = document.createElement('button');
                            addToOverlayButton.textContent = 'Add Pokemon';
                            addToOverlayButton.addEventListener('click', () => {
                                addPokemonToOverlay(data, overlay);
                                overlay.style.display = 'flex';
                            });
                            content1.appendChild(addToOverlayButton);
                        });
                    }
                });
            },
        );
    });

    // Adding styling to the app
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.width = '30vw';
    container.style.height = '90vh';
    container.style.margin = 'auto';
    content1.style.marginTop = '50px';
    button.textContent = 'Get Pokemon!';
    button.style.marginBottom = '10px';
    button.style.background = 'green';
    button.style.border = 'none';
    button.style.height = '30px';
    button.style.color = 'white';
    button.style.fontSize = '1.2em';
    selectEl.style.background = 'lightBlue';
    selectEl.style.height = '30px';
    selectEl.style.color = 'darkBlue';
    selectEl.style.fontSize = '1.2em';
    selectEl.style.border = 'none';
    selectEl.style.paddingLeft = '10px';
    image.style.width = '70%';
    image.style.height = '70%';
}

// Function to create the overlay
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.display = 'none'; // Initially hide the overlay

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none'; // Hide the overlay when the close button is clicked
    });

    overlay.appendChild(closeButton);

    document.body.appendChild(overlay);
    return overlay;
}

// Function to add Pokemon to the overlay
function addPokemonToOverlay(pokemon, overlay) {
    const pokemonContainer = document.createElement('div');
    pokemonContainer.classList.add('pokemon-container');

    const pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemon-element');
    pokemonElement.innerHTML = `
        <img src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">
        <p>${pokemon.name}</p>
    `;

    // Add a click event listener to remove the Pokemon when clicked
    pokemonElement.addEventListener('click', () => {
        overlay.removeChild(pokemonContainer);
    });

    pokemonContainer.appendChild(pokemonElement);

    // Check if there are already 3 Pokemon in the overlay, remove the oldest one if needed
    const existingPokemonCount = overlay.querySelectorAll('.pokemon-element').length;
    if (existingPokemonCount >= 3) {
        const pokemonElements = overlay.querySelectorAll('.pokemon-element');
        overlay.removeChild(pokemonElements[0]); // Remove the oldest Pokemon
    }

    overlay.appendChild(pokemonContainer);
}

// Calling the main function
main();





