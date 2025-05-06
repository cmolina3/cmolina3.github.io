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
function gameScoreReset(){
    localStorage.setItem("score", 0);
    window.location.href = "index.html";
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
    const generationsSelected = localStorage.getItem("generations");
    let gen = 0;
    let randomPokemon = null;
    if(window.location.pathname.endsWith('playScreen.html')){
        gen = generationsSelected[Math.floor(Math.random() * generationsSelected.length - 1)];
    }
    switch(gen){
        case "1":
            randomPokemon = Math.floor(Math.random() * 151) + 1; //range 1 - 151
            break;
        case "2":
            randomPokemon = Math.floor(Math.random() * 100) + 152;//range 152-251 
            break;
        case "3":
            randomPokemon = Math.floor(Math.random() * 135) + 252;//range 252-386
            break;
        case "4":
            randomPokemon = Math.floor(Math.random() * 107) + 387;//range 387-493
            break;
        case "5":
            randomPokemon = Math.floor(Math.random() * 156) + 494;//range 494-649
            break;
        case "6":
            randomPokemon = Math.floor(Math.random() * 72) + 650;//range 650-721
            break;
        case "7":
            randomPokemon = Math.floor(Math.random() * 88) + 722;//range 722-809
            break;
        case "8":
            randomPokemon = Math.floor(Math.random() * 96) + 810;//range 810-905
            break;
        case "9":
            randomPokemon = Math.floor(Math.random() * 120) + 906;//range 906-1025
            break;
        default:
            randomPokemon = Math.floor(Math.random() * 1025) + 1;//range 1-1025
            break;            
    }
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

async function submitScore() {
    var username = document.getElementById("usernameArea").value;
    var persistentScore = localStorage.getItem("score");
    await fetch('add_score.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username,score: persistentScore})
    });
    window.location.href = "index.html";
}

async function loadLeaderBoard(){
    const response = await fetch('get_leaderboard.php');
    const data = await response.json();
    const list = document.getElementById('leaderboard');
    list.innerHTML = '';
    const header = document.createElement("H1");
    const text = document.createTextNode("Leaderboard");
    header.appendChild(text);
    list.appendChild(header);
      data.forEach((entry,index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}.${entry.username}: ${entry.score}`;
        list.appendChild(li);
      });
}

if(window.location.pathname.endsWith('playScreen.html')){
    displayPokemonImage();
}
else if(window.location.pathname.endsWith('gameOver.html')){
    updateScoreElement();
}
else{
    refreshPokemon();
    loadLeaderBoard();
}
