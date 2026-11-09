import { describe, expect, it, vi } from 'vitest';
import { createInitialGameState } from '../src/game/createInitialGameState.js';
import { startGame } from '../src/game/startGame.js';
import { submitGuess } from '../src/game/submitGuess.js';
import type { GameState } from '../src/game/types.js';

const createPlayingState = (): GameState =>
  startGame(
    createInitialGameState(),
    () => 0.999999,
    () => 1000,
  );

describe('submitGuess', () => {
  it('adds a valid guess with its evaluation to history', () => {
    const state = createPlayingState();

    const updatedState = submitGuess(state, '1023');

    expect(updatedState.history).toEqual([
      {
        guess: '1023',
        bulls: 2,
        cows: 2,
      },
    ]);
    expect(updatedState.status).toBe('playing');
    expect(updatedState.finishedAt).toBeNull();
  });

  it('creates a new state and history without mutating the original', () => {
    const state = createPlayingState();

    const updatedState = submitGuess(state, '1023');

    expect(updatedState).not.toBe(state);
    expect(updatedState.history).not.toBe(state.history);
    expect(state.history).toEqual([]);
    expect(state.status).toBe('playing');
  });

  it('finishes the game when all digits are guessed', () => {
    const state = createPlayingState();
    const now = vi.fn(() => 2000);

    const updatedState = submitGuess(state, '0123', now);

    expect(updatedState.status).toBe('won');
    expect(updatedState.history).toEqual([
      {
        guess: '0123',
        bulls: 4,
        cows: 0,
      },
    ]);
    expect(updatedState.finishedAt).toBe(2000);
    expect(now).toHaveBeenCalledOnce();
  });

  it.each(['123', '01A3', '0023'])('rejects invalid guess "%s"', (guess) => {
    const state = createPlayingState();

    expect(submitGuess(state, guess)).toBe(state);
  });

  it('does not add a repeated guess to history', () => {
    const initialState = createPlayingState();

    const state: GameState = {
      ...initialState,
      history: [
        {
          guess: '1023',
          bulls: 2,
          cows: 2,
        },
      ],
    };

    expect(submitGuess(state, '1023')).toBe(state);
  });

  it('treats uppercase and lowercase hexadecimal guesses as duplicates', () => {
    const initialState = createPlayingState();

    const state: GameState = {
      ...initialState,
      settings: {
        length: 4,
        base: 16,
      },
      secret: 'a1b2',
      history: [
        {
          guess: 'A1B2',
          bulls: 0,
          cows: 4,
        },
      ],
    };

    expect(submitGuess(state, 'a1b2')).toBe(state);
  });

  it('does not accept guesses before the game starts', () => {
    const state = createInitialGameState();

    expect(submitGuess(state, '0123')).toBe(state);
  });

  it('does not accept guesses after the game is won', () => {
    const initialState = createPlayingState();

    const state: GameState = {
      ...initialState,
      status: 'won',
      finishedAt: 2000,
    };

    expect(submitGuess(state, '0123')).toBe(state);
  });
});
