import { guessResults, gameWon } from './gameState.js';

export function generateShareText(guessesUsed) {
    let result;
    if (gameWon){
      result = `I got today's Off-By-One-Dle in ${guessesUsed} ${guessesUsed > 1 ? 'tries' : 'try'}!\n\n`;
    }
    else {
      result = `Today's Off-By-One-Dle stumped me!\n\n`;
    }
    guessResults.forEach(row => {
        result += row.join('') + '\n';
    });
    result += "\nYou can play Off-By-One-Dle at https://nzoam93.github.io/one-off-dle"
    console.log(result)
    return result;
}
