import type { GameRecord, GameState } from './types.js';

export const createGameRecord = (state: GameState): GameRecord | null => {
  if (state.status !== 'won' || state.startedAt === null || state.finishedAt === null) {
    return null;
  }

  return {
    settings: { ...state.settings },
    attempts: state.history.length,
    durationMs: state.finishedAt - state.startedAt,
    completedAt: state.finishedAt,
  };
};
