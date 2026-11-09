import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../src/game/createInitialGameState.js';
import { resetGame } from '../src/game/resetGame.js';
import type { GameState } from '../src/game/types.js';

describe('resetGame', () => {
  it('returns the game to setup status', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'won',
      secret: '0123',
      history: [{ guess: '0123', bulls: 4, cows: 0 }],
      startedAt: 1000,
      finishedAt: 2000,
    };

    const resetState = resetGame(state);

    expect(resetState.status).toBe('setup');
    expect(resetState.secret).toBeNull();
    expect(resetState.history).toEqual([]);
    expect(resetState.startedAt).toBeNull();
    expect(resetState.finishedAt).toBeNull();
  });

  it('preserves the previous game settings', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      settings: {
        length: 5,
        base: 16,
      },
      status: 'won',
      secret: '01234',
    };

    expect(resetGame(state).settings).toEqual({
      length: 5,
      base: 16,
    });
  });

  it('creates new state, settings and history references', () => {
    const state = createInitialGameState();

    const resetState = resetGame(state);

    expect(resetState).not.toBe(state);
    expect(resetState.settings).not.toBe(state.settings);
    expect(resetState.history).not.toBe(state.history);
  });

  it('does not mutate the original state', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'won',
      secret: '0123',
      history: [{ guess: '0123', bulls: 4, cows: 0 }],
      startedAt: 1000,
      finishedAt: 2000,
    };

    resetGame(state);

    expect(state.status).toBe('won');
    expect(state.secret).toBe('0123');
    expect(state.history).toHaveLength(1);
    expect(state.startedAt).toBe(1000);
    expect(state.finishedAt).toBe(2000);
  });

  it('can reset a game that is still playing', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'playing',
      secret: '0123',
      startedAt: 1000,
    };

    const resetState = resetGame(state);

    expect(resetState.status).toBe('setup');
    expect(resetState.secret).toBeNull();
    expect(resetState.startedAt).toBeNull();
  });
});
