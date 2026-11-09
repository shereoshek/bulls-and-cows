import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../src/game/createInitialGameState.js';
import { updateGameSettings } from '../src/game/updateGameSettings.js';
import type { GameSettings, GameState } from '../src/game/types.js';

describe('updateGameSettings', () => {
  it('updates settings when the game is in setup status', () => {
    const state = createInitialGameState();
    const settings: GameSettings = {
      length: 5,
      base: 16,
    };

    const updatedState = updateGameSettings(state, settings);

    expect(updatedState.settings).toEqual(settings);
    expect(updatedState).not.toBe(state);
  });

  it('creates a new settings object without mutating the original', () => {
    const state = createInitialGameState();
    const settings: GameSettings = {
      length: 3,
      base: 8,
    };

    const updatedState = updateGameSettings(state, settings);

    expect(updatedState.settings).not.toBe(settings);
    expect(state.settings).toEqual({
      length: 4,
      base: 10,
    });
  });

  it('rejects settings when length exceeds the base', () => {
    const state = createInitialGameState();
    const settings: GameSettings = {
      length: 4,
      base: 2,
    };

    expect(updateGameSettings(state, settings)).toBe(state);
  });

  it('does not update settings when the game is playing', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'playing',
      secret: '1234',
      startedAt: 1000,
    };

    const settings: GameSettings = {
      length: 5,
      base: 16,
    };

    expect(updateGameSettings(state, settings)).toBe(state);
  });

  it('does not update settings when the game is won', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'won',
      secret: '1234',
      startedAt: 1000,
      finishedAt: 2000,
    };

    const settings: GameSettings = {
      length: 5,
      base: 16,
    };

    expect(updateGameSettings(state, settings)).toBe(state);
  });
});
