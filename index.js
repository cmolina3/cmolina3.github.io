let intervalID;

async function getRandomPokemonSprite(){
    const randomPokemon = Math.floor(Math.random() * 1025) + 1;
    try{
    const pokemonPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    if(!pokemonPromise.ok){
        throw new Error('Failed to fetch Pokemon Data');
    }
    const pokemonData = await pokemonPromise.json(); 
    return pokemonData.sprites.front_default;
    }
    catch(error){
        console.error('Error fetching Pokemon sprite:', error);
        return null;
    }
}

async function displayPokemonImage() {
    const spriteUrl = await getRandomPokemonSprite();
    if(!spriteUrl){
        console.error('No sprite URL found');
        return;
    }
    const imgElement = document.createElement('img');
    imgElement.src = spriteUrl;
    imgElement.alt = 'No Sprite Found';

    const container = document.getElementById('pokemon-image-container');
    if(!container.firstChild){
        container.appendChild(imgElement);
    }
    else{
        container.removeChild(container.firstChild);
        container.appendChild(imgElement);
    }
}

function refreshPokemon(){
    if(intervalID){
        console.log('Interval is already running');
        return;
    }
    displayPokemonImage();
    //2500 ms or 2.5 seconds
    intervalID = setInterval(displayPokemonImage, 2500);
}

function stopSpriteRefresh(){
    if(!intervalID){
        console.log('Interval already stopped');
        return;
    }
    clearInterval(intervalID);
    intervalID = null;
    const container = document.getElementById('pokemon-image-container');
    container.removeChild(container.firstChild);
}
refreshPokemon();