import { generateSecret } from './generateSecret.js';
import type { GameState } from './types.js';

export const startGame = (
  state: GameState,
  random: () => number = Math.random,
  now: () => number = Date.now,
): GameState => {
  if (state.status !== 'setup' || state.settings.length > state.settings.base) {
    return state;
  }

  const secret = generateSecret(state.settings.length, state.settings.base, random);

  return {
    ...state,
    status: 'playing',
    secret,
    history: [],
    startedAt: now(),
    finishedAt: null,
  };
};
