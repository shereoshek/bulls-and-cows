import { evaluateGuess } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';
import type { GameState, GuessEntry } from './types.js';

export const submitGuess = (
  state: GameState,
  guess: string,
  now: () => number = Date.now,
): GameState => {
  if (state.status !== 'playing' || state.secret === null) {
    return state;
  }

  if (!isValidGuess(guess, state.settings.length, state.settings.base)) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();

  const isDuplicate = state.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);

  if (isDuplicate) {
    return state;
  }

  const result = evaluateGuess(state.secret, guess);

  const entry: GuessEntry = {
    guess,
    bulls: result.bulls,
    cows: result.cows,
  };

  const updatedHistory = [...state.history, entry];

  const hasWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: updatedHistory,
    status: hasWon ? 'won' : 'playing',
    finishedAt: hasWon ? now() : state.finishedAt,
  };
};
