import { describe, expect, it } from 'vitest';
import { createGameRecord } from '../src/game/createGameRecord.js';
import { createInitialGameState } from '../src/game/createInitialGameState.js';
import type { GameState } from '../src/game/types.js';

const createWonState = (): GameState => {
  const initialState = createInitialGameState();

  return {
    ...initialState,
    status: 'won',
    secret: '0123',
    history: [
      { guess: '1023', bulls: 2, cows: 2 },
      { guess: '3120', bulls: 0, cows: 3 },
      { guess: '0123', bulls: 4, cows: 0 },
    ],
    startedAt: 1000,
    finishedAt: 25000,
  };
};

describe('createGameRecord', () => {
  it('creates a record from a won game', () => {
    const state = createWonState();

    expect(createGameRecord(state)).toEqual({
      settings: {
        length: 4,
        base: 10,
      },
      attempts: 3,
      durationMs: 24000,
      completedAt: 25000,
    });
  });

  it('preserves the settings of the completed game', () => {
    const state = createWonState();

    state.settings = {
      length: 5,
      base: 16,
    };

    expect(createGameRecord(state)?.settings).toEqual({
      length: 5,
      base: 16,
    });
  });

  it('creates independent settings without mutating the game state', () => {
    const state = createWonState();
    const record = createGameRecord(state);

    expect(record?.settings).not.toBe(state.settings);
    expect(state.settings).toEqual({
      length: 4,
      base: 10,
    });
  });

  it('returns null when the game has not been won', () => {
    const state = createInitialGameState();

    expect(createGameRecord(state)).toBeNull();
  });

  it('returns null when the game timestamps are missing', () => {
    const state: GameState = {
      ...createWonState(),
      startedAt: null,
    };

    expect(createGameRecord(state)).toBeNull();
  });
});
