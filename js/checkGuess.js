import {currentGuess, secretWord, wordLength, numberOfGuesses, dictionary, setCurrentGuess, setGameOver, setNumberOfGuesses, guessResults, gameOver, gameDifficulty } from "./gameState.js"
import { shakeRow, showAlert } from "./utils.js"

//actions at the end of the game (regardless of win or lose)
function endGameActions(){
    setGameOver(true);
    document.getElementById("board-container").classList.add("blur");
    document.getElementById("shareBtn").style.display = "block";
    document.querySelectorAll(".newGameBtn").forEach(button => {
        button.style.display = "block";
    });
}

export function checkGuess(){
    let emojiRow = []
    let guess = currentGuess.join("")
    const letterCount = {}

     // Check if guess is in dictionary of words
    if (!dictionary.includes(guess)) {
        shakeRow(`row-${numberOfGuesses}`)
        showAlert("Guess not in word list")
        return; // Exit early, don't process the guess
    }

    for (let char of secretWord) { //used to keep track of words with multiple of the same letter
        letterCount[char] = (letterCount[char] || 0) + 1;
    }


    // First pass: determine the green letters
    for (let i = 0; i < wordLength; i++) {
        const square = document.getElementById(`square-${numberOfGuesses}-${i}`);
        const letter = currentGuess[i];
        const keyButton = document.querySelector(`button[data-key="${letter}"]`);
        if (letter === secretWord[i]) {
            square.classList.add("correct");
            letterCount[letter]-- // don't allow the same letter to be counted twice

            // update the keyboard
            if (keyButton) {
                keyButton.classList.remove("half-right", "wrong");
                keyButton.classList.add("correct");
            }
        }
    }

    //Second pass: determine the yellow letters
    for (let i = 0; i < wordLength; i++) {
        const square = document.getElementById(`square-${numberOfGuesses}-${i}`);
        const letter = currentGuess[i];
        const keyButton = document.querySelector(`button[data-key="${letter}"]`);
        if (letter === secretWord[i]){
            //update the emojiRow
            emojiRow.push("🟩")
        }
        if (letter !== secretWord[i]) {
            if (secretWord.includes(letter) && letterCount[letter] > 0){
                square.classList.add("half-right");
                letterCount[letter]--;

                //update keyboard color
                if (keyButton && !keyButton.classList.contains("correct")) {
                    keyButton.classList.remove("wrong");
                    keyButton.classList.add("half-right");
                }

                //update the emojiRow
                emojiRow.push("🟨")
            }
            else {
                square.classList.add("wrong");

                //update keyboard color
                if (keyButton && !keyButton.classList.contains("correct") && !keyButton.classList.contains("half-right")) {
                    keyButton.classList.add("wrong");
                }

                //update the emojiRow
                emojiRow.push("⬛")
            }
        }
    }
    guessResults.push(emojiRow)

    //check to see if the word was right
    setNumberOfGuesses(numberOfGuesses + 1);
    if (guess === secretWord) {
        showAlert("Congrats, you got it right!", 2000, 15)
        endGameActions();
    }
    else {
        if (numberOfGuesses === 6) {
            showAlert(`The secret word was ${secretWord}`, 2000, 15)
            endGameActions();
        }
    }

    //perform the offByOne stuff
    if(!gameOver){
        if(gameDifficulty === "easy"){
            offByOneOnEasy()
        } else {
            offByOneHard();
        }
    }

    //reset the guess array
    setCurrentGuess([]);
}

// can change to any of the other options
function offByOneHard() {
    const randomIndex = Math.floor(Math.random() * wordLength);
    const square = document.getElementById(`square-${numberOfGuesses - 1}-${randomIndex}`);
    const letter = currentGuess[randomIndex];
    console.log('letter changed: ', letter);
    const keyButton = document.querySelector(`button[data-key="${letter}"]`);
    const states = ["correct", "half-right", "wrong"];

    if (!square || !keyButton) return;

    const currentState = states.find(state => square.classList.contains(state));
    if (!currentState) return;

    // Remove the current state classes
    square.classList.remove(...states);
    keyButton.classList.remove(...states);

    // Get the two alternative states (excluding current one)
    const alternatives = states.filter(state => state !== currentState);
    const newState = alternatives[Math.floor(Math.random() * 2)];

    // Apply the new state
    square.classList.add(newState);
    keyButton.classList.add(newState);
}

// doesn't change green ones
function offByOneOnEasy() {
    const states = ["correct", "half-right", "wrong"];
    const rowIndex = numberOfGuesses - 1;

    // Get all squares in the row that are not "correct"
    const nonGreenSquares = [];
    for (let i = 0; i < wordLength; i++) {
        const square = document.getElementById(`square-${rowIndex}-${i}`);
        if (square && !square.classList.contains("correct")) {
            nonGreenSquares.push({ index: i, square });
        }
    }

    // If all are green or none found, do nothing
    if (nonGreenSquares.length === 0) return;

    // Choose one at random
    const { index, square } = nonGreenSquares[Math.floor(Math.random() * nonGreenSquares.length)];
    const letter = currentGuess[index];
    console.log('letter changed: ', letter);
    const keyButton = document.querySelector(`button[data-key="${letter}"]`);
    if (!keyButton) return;

    const currentState = states.find(state => square.classList.contains(state));
    if (!currentState || currentState === "correct") return;

    // Remove all color states
    square.classList.remove(...states);
    keyButton.classList.remove(...states);

    // Choose a new state that isn't the current one or "correct"
    const alternatives = states.filter(state => state !== currentState && state !== "correct");
    const newState = alternatives[Math.floor(Math.random() * alternatives.length)];

    square.classList.add(newState);
    keyButton.classList.add(newState);
}
