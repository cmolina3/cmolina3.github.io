let intervalID;
let currentPokemon = null;
let score = 0;
let errorCounter = 0;

function updateScoreElement(){
    const scoreElement = document.getElementById('scoreElement');
    let persistentScore = localStorage.getItem("score"); //this grabs the persistent score made in guessPokemon()
    scoreElement.textContent = persistentScore;
}

function clearAnswerArea(){
    document.getElementById('answerArea').value = '';
}

function incorrectAnswer(){
    const mistakes = document.querySelectorAll('.X')
    if(errorCounter == 3){
        window.location.href = "gameOver.html";
    }
    else{
        mistakes.forEach(mistake => {
            if(errorCounter >= mistake.getAttribute('data-value')){
                mistake.classList.add('highlighted')
            }
        });
        clearAnswerArea();
        displayPokemonImage();
    }
}

async function getRandomPokemonSprite(){
    const randomPokemon = Math.floor(Math.random() * 1025) + 1;
    try{
    const pokemonPromise = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemon}`);
    if(!pokemonPromise.ok){
        throw new Error('Failed to fetch Pokemon Data');
    }
    const pokemonData = await pokemonPromise.json();
    currentPokemon = pokemonData.species.name; 
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
    imgElement.classList.add('pokemonImg');
    imgElement.src = spriteUrl;
    imgElement.alt = 'No Sprite Found';

    const container = document.getElementById('pokemonImageContainer');
    if(!container.firstChild){
        container.appendChild(imgElement);
    }
    else{
        container.removeChild(container.firstChild);
        container.appendChild(imgElement);
    }
}
function guessPokemon(){
    let guess = document.getElementById("answerArea").value.toLowerCase();
    if(guess == currentPokemon){
        score += 100;
        localStorage.setItem("score",score);// this enables score to persist to other pages
        updateScoreElement();
        clearAnswerArea();
        displayPokemonImage();
    }
    else{
        errorCounter += 1;
        incorrectAnswer();
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
    const container = document.getElementById('pokemonImageContainer');
    container.removeChild(container.firstChild);
}
if(window.location.pathname.endsWith('index.html')){
    refreshPokemon();
}
else if(window.location.pathname.endsWith('gameOver.html')){
    updateScoreElement();
}
else{
    displayPokemonImage();
}