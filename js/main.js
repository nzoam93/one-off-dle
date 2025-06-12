//imports
import { createBoard } from "./board.js";
import { createKeyboard } from "./keyboard.js";
import { handleKey } from "./handleKey.js";
import {numRows, wordLength, setSecretWord, setDictionary, numberOfGuesses, secretWord, setCurrentGuess, setNumberOfGuesses, setGameOver, setGuessResults, setGameDifficulty } from "./gameState.js";
import { generateShareText } from "./generateShareText.js";
import { showAlert } from "./utils.js";

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
    newGame(difficulty);
  });
});

function resetGameState(){
  // hide the info screen
  document.getElementById('infoScreen').style.display = "none";

  // reset game state
  setCurrentGuess([]);
  setNumberOfGuesses(0);
  setGameOver(false);
  setGuessResults([]);

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
function newGame(difficulty){
  // reset to new game
  resetGameState()

  // set difficulty
  setGameDifficulty(difficulty);

  // choose a random word
  fetch('./word-bank-answers.txt')
    .then(res => res.text())
    .then(text => {
      const possibleAnswers = text.split('\n').map(word => word.trim().toUpperCase());
      let randomWord = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
      setSecretWord(randomWord.toUpperCase())
      console.log(secretWord)
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
