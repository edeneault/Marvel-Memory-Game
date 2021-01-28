//selectors
const body = document.querySelector('body');
const gameContainer = document.querySelector('.game-container');
const introContainer = document.querySelector('.intro-container');
const endContainer = document.querySelector('.end-container');
const cards = document.querySelectorAll('.card');
const cardBacks = document.querySelectorAll('.cardback');
const introDiv = document.createElement('div');
const introText = document.createElement('h3');
const endDiv = document.createElement('div');
const endText = document.createElement('h3');
const timeUpdate = document.querySelector('#current-time');
const scoreUpdate = document.querySelector('#current-score');
const bestScoreBoard = document.querySelector('#best-score');
const bestTimeBoard = document.querySelector('#best-time');
const startButton = document.querySelector('#start');
let bestScore = JSON.parse(localStorage.getItem("best-score"));
let bestTime = JSON.parse(localStorage.getItem("best-time"));

// Game State Properties
let cardCount = 0;
let selectedCards = [];
let matchedCount = 0;
let gameStart = 0;
let currentScore = 0;
let currentTime = 0;
let time;
let previousClicked;

const CARDS = [
  "url('assets/iron-man.png')",
  "url('assets/spiderman.png')",
  "url('assets/captain-america.png')",
  "url('assets/hulk.png')",
  "url('assets/black-widow.png')",
  "url('assets/iron-man.png')",
  "url('assets/spiderman.png')",
  "url('assets/hulk.png')",
  "url('assets/captain-america.png')",
  "url('assets/black-widow.png')"
];

let shuffledCards = shuffle(CARDS);

// set scoreboard values for the scoreboard mark-up from local storage
bestScoreBoard.innerText = bestScore;
bestTimeBoard.innerText = bestTime;

// if scoreboard values empty set 0 to local storage and the mark-up
// else set values from local storage to the mark-up
if ($('#best-score').is(':empty')) {
  localStorage.setItem('best-score', JSON.stringify(0));
  bestScore = 0;
  bestScoreBoard.innerText = bestScore;
}
else {
  bestScoreBoard.innerText = bestScore;
}
if ($('#best-time').is(':empty')) {
  localStorage.setItem('best-time', JSON.stringify(0));
  bestTime = 0;
  bestTimeBoard.innerText = bestTime;
}
else {
  bestTimeBoard.innerText = bestTime;
}

// Function - constructor START message
function introMessage() {
  introDiv.classList.add('container', 'col-12', 'col-sm-4', 'pb-2');
  introDiv.style.opacity = '1';
  
  introContainer.append(introDiv);
  introDiv.append(introText);
  introText.innerText = `Click the START Button`;
}

// Function to trigger game start
function startGame() {
  startButton.addEventListener('click', function(event) {
    
    if (gameStart === 0) {
      gameStart++;
      createDivsForColors(shuffledCards);
      introText.parentNode.remove();
  
      let start = Date.now();
      console.log("date: ", start)
      time = setInterval(function() {
          let delta = Date.now() - start; 
          let timeOutput = (Math.floor(delta / 1000)); // in seconds
          timeUpdate.innerText = (timeOutput.toString());
          }, 1000); 
    }
    else {return}
  });
}

// Fisher Yates algorithm
function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// Game Dynamic Mark-Up Costructor
function createDivsForColors(cardArray) {
  for (let card of cardArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(card);
    newDiv.classList.add("card");
    newDiv.style.backgroundImage = newDiv.classList[0];
    newDiv.style.borderRadius = 10;
    gameContainer.append(newDiv);

    const cardBack = document.createElement('div');
    cardBack.classList.add(card);
    cardBack.classList.add('cardback');
    cardBack.addEventListener("click", handleCardClick);
		newDiv.append(cardBack);
  }
}

// handle click event -  Game Flow Control
function handleCardClick(event) {
  
  // update Score
  currentScore++;
  scoreUpdate.innerText = (currentScore.toString());
  // Exit if 2 cards are already showing
  if (cardCount > 1) {return;}
  cardCount++;
  let divClicked = event.target;
  
  selectedCards.push(divClicked);
  
  // check if the click event is on the same element as the provious clicked event and handle
  if (previousClicked === divClicked) {
    selectedCards.pop();
    previousClicked.classList.remove('shown');
    previousClicked.parentNode.classList.remove('shown');
    selectedCards = [];
    cardCount = 0;
    currentScore--;
    previousClicked = 0;
    
    return;
  }
  // Put into memory to track previous event
  previousClicked = divClicked;
 
  // change card to showning
  divClicked.classList.add('shown');
  divClicked.parentNode.classList.add('shown');
  
  //check if only 1 card is showing
  if (cardCount === 1){return;}

 // 2 cards showing, check if a match, add to matched count, check if all cards matched
  if (selectedCards[0].classList[0] === selectedCards[1].classList[0]) {
    for (card of selectedCards) {
      card.classList.add('matched');
      card.parentNode.classList.add('matched');
    }
    selectedCards = [];
    cardCount = 0;
    matchedCount++;
    if (matchedCount === CARDS.length/2) {
      console.log("All DONE. GAME OVER");
      success();
    }
    return;
  }
  
  setTimeout(function() {
    // Prevents issue where a timeout timer would remain after completeing a pair, causing any card 
    // flipped within the timeout timer from the last card of the match pair to be flipped when that timer ran out
		if (selectedCards.length === 1) {
			return;
		}
		for (card of selectedCards) {
			card.classList.remove('shown');
			card.parentNode.classList.remove('shown');
		}
		//reset some game state variables
		selectedCards = [];
		cardCount = 0;
	}, 1000);
}

// function triggered by the game ending
function success() {
  clearInterval(time);

  if (parseInt(scoreUpdate.innerText) < parseInt(bestScore) || parseInt(bestScore) === 0) {
    bestScore = scoreUpdate.innerText;
    bestScoreBoard.innerText = bestScore;
    localStorage.setItem('best-score', JSON.stringify(parseInt(bestScore)));
  }

  if (parseInt(timeUpdate.innerText) < parseInt(bestTime) || parseInt(bestTime) === 0) {
    bestTime = timeUpdate.innerText;
    bestTimeBoard.innerText = bestTime;
    localStorage.setItem('best-time', JSON.stringify(parseInt(bestTime)));
  }
  gameReset();
  startGame();
}

// function to reset game 
function gameReset() {
  endDiv.classList.add('container', 'col-12', 'col-sm-4');
  endContainer.append(endDiv);
  endDiv.append(endText);
  
  let scoreResult = scoreUpdate.innerText;
  let timeResult = timeUpdate.innerText;
  endText.innerText = `Congrats! you solved the game in ${timeResult} sec. and a score of ${scoreResult}`;
  
  setTimeout(function() {
    endText.parentNode.remove();
    introDiv.classList.add('container', 'col-12', 'col-sm-4');
    introContainer.append(introDiv);
    introDiv.append(introText);
    introText.innerText = `Click the START Button`;
  }, 4000);
  
  gameStart = 0;

  oldCards = document.querySelectorAll('.card');
	for (card of oldCards) {
		card.remove();
	}
	oldCardBacks = document.querySelectorAll('.cardback');
	for (cardback of oldCardBacks) {
		cardBack.remove();
	}
  matchedCount = 0;
  shuffledCards = shuffle(CARDS);

  currentScore = 0;
  scoreUpdate.innerText = (currentScore.toString());
  timeOutput = 0;
  timeUpdate.innerText = (timeOutput.toString());
  
}


//  Main //


introMessage();
startGame();