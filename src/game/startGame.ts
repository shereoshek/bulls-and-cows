import type { GameState } from './types.js';

export const startGame = (
  state: GameState,
  random: () => number = Math.random,
  now: () => number = Date.now,
): GameState => {
  void state;
  void random;
  void now;

  throw new Error('Not implemented');
};
