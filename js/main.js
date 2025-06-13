//imports
import { createBoard } from "./board.js";
import { createKeyboard } from "./keyboard.js";
import { handleKey } from "./handleKey.js";
import {numRows, wordLength, setSecretWord, setDictionary, numberOfGuesses, secretWord, setCurrentGuess, setNumberOfGuesses, setGameOver, setGuessResults, setGameDifficulty } from "./gameState.js";
import { generateShareText } from "./generateShareText.js";
import { showAlert } from "./utils.js";
import { hasPlayedToday, markGamePlayedToday, timerInterval } from "./onceADay.js";


// event listener - keydown
document.addEventListener("keydown", handleKey);

// event listener - share button
document.getElementById("shareBtn").addEventListener("click", () => {
    const text = generateShareText(numberOfGuesses);
    navigator.clipboard.writeText(text).then(() => {
        showAlert("Result copied to clipboard. Paste to share results!", 4000, 22);
    });
});

// event listener - new game
const newGameButtons = document.querySelectorAll(".newGameBtn");
newGameButtons.forEach(button => {
  button.addEventListener("click", () => {
    // Determine difficulty by checking the classList
    let difficulty = button.classList.contains("easy") ? "easy" : "hard";
    let practice = button.classList.contains("practice") ? true : false
    newGame(difficulty, practice);
  });
});

function resetGameState(){
  // hide the info screen
  document.getElementById('infoScreen').style.display = "none";

  // ready the alreadyPlayed screen
  document.getElementById("alreadyPlayedMessage").style.display = "none";
  clearInterval(timerInterval);

  // reset game state
  setCurrentGuess([]);
  setNumberOfGuesses(0);
  setGameOver(false);
  setGuessResults([]);
  markGamePlayedToday();

  //reset board and keyboard
  const board = document.getElementById("board");
  board.innerHTML = "";
  const keyboardContainer = document.getElementById("keyboard");
  keyboardContainer.innerHTML = "";

  //hide the buttons again
  document.getElementById("shareBtn").style.display = "none";
  document.querySelectorAll(".newGameBtn").forEach(button => {
    button.style.display = "none";
  });
  //remove board blur
  document.getElementById("board-container").classList.remove("blur");
}

// Game Logic
function newGame(difficulty, practice){
  // reset to new game
  resetGameState()

  // set difficulty
  setGameDifficulty(difficulty);

  // choose a random word
  fetch('./word-bank-answers.txt')
    .then(res => res.text())
    .then(text => {
      const possibleAnswers = text.split('\n').map(word => word.trim().toUpperCase());
      if(!practice){
        //daily word
        const now = new Date();
        const startDate = new Date("2025-06-09");
        const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        const index = daysSinceStart % possibleAnswers.length;
        setSecretWord(possibleAnswers[index].toUpperCase());
        console.log(secretWord)
      }
      else {
        //random word
        let randomWord = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
        setSecretWord(randomWord.toUpperCase())
        console.log(secretWord)
      }
  })

  fetch('./word-bank.txt')
    .then(res => res.text())
    .then(text => {
      // set the dictionary of words to the allowed list of words
      const fileWords = text.split('\n').map(word => word.trim().toUpperCase());
      setDictionary(fileWords)

      //create the board and keyboard
      createBoard(numRows, wordLength);
      createKeyboard();

      //allow the board to be dynamic to not just 6x5
      const board = document.getElementById("board");
      board.style.setProperty("--numRows", numRows);
      board.style.setProperty("--wordLength", wordLength);
    });
}

//Once a day features
window.addEventListener("DOMContentLoaded", () => {
  if (hasPlayedToday()) {
    // Game was already played today — show message
    document.getElementById("beginningInfoScreen").style.display = "none";
    document.getElementById("alreadyPlayedMessage").style.display = "block";
  } else {
    // Game can be played — show game
    document.getElementById("game").style.display = "block";
    document.getElementById("alreadyPlayedMessage").style.display = "none";
  }
});
