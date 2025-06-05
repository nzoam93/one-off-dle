import { guessResults } from './gameState.js';

let gameNumber = 1;

export function generateShareText(guessesUsed) {
    let result = `I got today's Off-By-One-Dle in ${guessesUsed} ${guessesUsed > 1 ? 'tries' : 'try'}!\n\n`;
    guessResults.forEach(row => {
        result += row.join('') + '\n';
    });
    console.log(result)
    return result;
}
