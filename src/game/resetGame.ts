import { createInitialGameState } from './createInitialGameState.js';
import type { GameState } from './types.js';

export const resetGame = (state: GameState): GameState => {
  const initialState = createInitialGameState();

  return {
    ...initialState,
    settings: { ...state.settings },
  };
};
