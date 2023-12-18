export function showMessage(message, isError = false, isRemainingPokemonMessage = false) {
	const messageContainer = document.getElementById('messageContainer');
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
  
  export function updatePokemonBoxes(team, overlayContainer) {
	const pokemonBoxes = document.querySelectorAll('.pokemon-box');
	const overlay = document.getElementById('overlay');
  
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
	  updateOverlayContent(team, overlay);
	}
  }
  
  export function updateReserveList(reserve) {
	const reserveList = document.getElementById('reserveList');
	reserveList.innerHTML = '';
  
	reserve.forEach((pokemon, index) => {
	  const pokemonBox = document.createElement('div');
	  pokemonBox.classList.add('reserve-pokemon-box');
  
	  pokemonBox.innerHTML = `<p>${pokemon.nickname ? `${pokemon.nickname} (${pokemon.name})` : pokemon.name}</p>
							  <img src="${pokemon.image}" alt="${pokemon.name} Image">`;
  
	  pokemonBox.addEventListener('click', () => {
		reserve.splice(index, 1);
		updateReserveList(reserve);
	  });
  
	  reserveList.appendChild(pokemonBox);
	});
  }
  
  export function updateOverlayContent(team, overlay) {
	overlay.innerHTML = '';
  
	team.forEach((pokemon, index) => {
	  const pokemonBox = document.createElement('div');
	  pokemonBox.classList.add('pokemon-box-overlay');
  
	  pokemonBox.innerHTML = `<p>${pokemon.nickname ? `${pokemon.nickname} (${pokemon.name})` : pokemon.name}</p>
							  <img src="${pokemon.image}" alt="${pokemon.name} Image">`;
  
	  pokemonBox.addEventListener('click', () => {
		team.splice(index, 1);
		updatePokemonBoxes(team, overlay);
	  });
  
	  overlay.appendChild(pokemonBox);
	});
  }
  


  