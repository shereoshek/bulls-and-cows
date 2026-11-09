import type { GameState } from './types.js';

export const createInitialGameState = (): GameState => ({
  settings: {
    length: 4,
    base: 10,
  },
  status: 'setup',
  secret: null,
  history: [],
  startedAt: null,
  finishedAt: null,
});
