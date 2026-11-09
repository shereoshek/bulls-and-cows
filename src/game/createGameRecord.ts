import type { GameRecord, GameState } from './types.js';

export const createGameRecord = (state: GameState): GameRecord | null => {
  void state;

  throw new Error('Not implemented');
};
