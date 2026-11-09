import type { GameState } from './types.js';

export const submitGuess = (
  state: GameState,
  guess: string,
  now: () => number = Date.now,
): GameState => {
  void state;
  void guess;
  void now;

  throw new Error('Not implemented');
};
