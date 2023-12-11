/*
In this exercise you're going to do several things:
Create and append DOM elements using JavaScript only
Fetch data twice from a public API PokeAPI
Display the results in the DOM.
Here are the requirements:
Create 3 functions: fetchData, addPokemonToDOM and main
The main function executes the other functions and contains all the variables
In the fetchData function, make use of fetch and its Promise syntax in order to get the data from the public API
Execute the main function when the window has finished loading
*/
// Create fetchData function to fetch the data from pokemon API
function fetchData(url) {
	return fetch(url).then(response => response.json());
  }
  // Create addPokemonToDOM to add the pokemon to select DOM element
  function addPokemonToDOM(pokemon, selectEl) {
	let output;
	pokemon.results.forEach(singlePokemon => {
	  output += `
	  <option value = "${singlePokemon.name}">${singlePokemon.name}</option>
	  `;
	});
	selectEl.innerHTML = output;
  }
  // Create the main function that contains the DOM elements and execute the fetch data and add element to the DOM
  function main() {
	// Needed DOM elements: button, select and options(will be added inside first fetch), div or img element to display the images (supposed to be added with second fetch)
  
	// 1 Creating DOM elements
	const container = document.createElement('div');
	const button = document.createElement('button');
	const selectEl = document.createElement('select');
	const image = document.createElement('img');
	const content1 = document.createElement('div');
  
	// 2. Appending DOM elements to document body
	document.body.appendChild(container);
  
	container.appendChild(button);
	container.appendChild(selectEl);
	container.appendChild(content1);
  
	// Add event listener for click event of the button
  
	button.addEventListener('click', () => {
	  fetchData('https://pokeapi.co/api/v2/pokemon?limit=151').then(
		pokemonData => {
		  addPokemonToDOM(pokemonData, selectEl);
		},
	  );
	});
	// Add event listener to the change of the selected options
	selectEl.addEventListener('change', event => {
	  console.log(event.target.value);
	  fetchData('https://pokeapi.co/api/v2/pokemon?limit=151').then(
		pokemonData => {
		  pokemonData.results.forEach(result => {
			if (event.target.value === result.name) {
			  const pokemonURL = result.url;
			  fetchData(pokemonURL).then(data => {
				console.log(data);
				const imagesData = data.sprites.other.dream_world.front_default;
				image.src = imagesData;
				content1.appendChild(image);
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
	image.style.width = '90%';
	image.style.height = '70%';
  }
  
  main();