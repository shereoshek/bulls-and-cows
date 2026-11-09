import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../src/game/createInitialGameState.js';

describe('createInitialGameState', () => {
  it('creates a game with default settings', () => {
    expect(createInitialGameState()).toEqual({
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
  });

  it('returns independent state objects', () => {
    const firstState = createInitialGameState();
    const secondState = createInitialGameState();

    expect(firstState).not.toBe(secondState);
    expect(firstState.settings).not.toBe(secondState.settings);
    expect(firstState.history).not.toBe(secondState.history);
  });
});
