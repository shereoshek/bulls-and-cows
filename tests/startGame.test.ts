import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../src/game/createInitialGameState.js';
import { startGame } from '../src/game/startGame.js';
import type { GameState } from '../src/game/types.js';

describe('startGame', () => {
  it('starts a game and generates a secret using current settings', () => {
    const initialState = createInitialGameState();
    const state: GameState = {
      ...initialState,
      settings: {
        length: 3,
        base: 8,
      },
    };

    const startedState = startGame(
      state,
      () => 0.999999,
      () => 123456,
    );

    expect(startedState.status).toBe('playing');
    expect(startedState.secret).toBe('012');
    expect(startedState.startedAt).toBe(123456);
  });

  it('sets finishedAt to null when starting a game', () => {
    const state = createInitialGameState();

    const startedState = startGame(
      state,
      () => 0.999999,
      () => 123456,
    );

    expect(startedState.finishedAt).toBeNull();
  });

  it('starts with an empty history', () => {
    const state = createInitialGameState();

    const startedState = startGame(
      state,
      () => 0.999999,
      () => 123456,
    );

    expect(startedState.history).toEqual([]);
  });

  it('creates a new state without mutating the original', () => {
    const state = createInitialGameState();

    const startedState = startGame(
      state,
      () => 0.999999,
      () => 123456,
    );

    expect(startedState).not.toBe(state);
    expect(startedState.history).not.toBe(state.history);
    expect(state.status).toBe('setup');
    expect(state.secret).toBeNull();
    expect(state.startedAt).toBeNull();
  });

  it('does not start a game when status is playing', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'playing',
      secret: '1234',
      startedAt: 1000,
    };

    expect(startGame(state)).toBe(state);
  });

  it('does not start a game when status is won', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      status: 'won',
      secret: '1234',
      startedAt: 1000,
      finishedAt: 2000,
    };

    expect(startGame(state)).toBe(state);
  });

  it('rejects settings when length exceeds the base', () => {
    const initialState = createInitialGameState();

    const state: GameState = {
      ...initialState,
      settings: {
        length: 6,
        base: 2,
      },
    };

    expect(startGame(state)).toBe(state);
  });
});
