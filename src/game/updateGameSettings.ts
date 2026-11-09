import type { GameSettings, GameState } from './types.js';

export const updateGameSettings = (state: GameState, settings: GameSettings): GameState => {
  if (state.status !== 'setup' || settings.length > settings.base) {
    return state;
  }

  return {
    ...state,
    settings: { ...settings },
  };
};
