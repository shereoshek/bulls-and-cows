import { describe, expect, it } from 'vitest';
import { isValidGuess } from '../src/game/isValidGuess.js';

const validCases = [
  {
    guess: '01',
    length: 2,
    base: 2,
  },
  {
    guess: '701',
    length: 3,
    base: 8,
  },
  {
    guess: '9081',
    length: 4,
    base: 10,
  },
  {
    guess: '0123',
    length: 4,
    base: 10,
  },
  {
    guess: 'a1b2',
    length: 4,
    base: 16,
  },
  {
    guess: 'A1B2',
    length: 4,
    base: 16,
  },
  {
    guess: 'F0A9',
    length: 4,
    base: 16,
  },
];

const invalidCases = [
  {
    guess: '123',
    length: 4,
    base: 10,
  },
  {
    guess: '12345',
    length: 4,
    base: 10,
  },
  {
    guess: '02',
    length: 2,
    base: 2,
  },
  {
    guess: '128',
    length: 3,
    base: 8,
  },
  {
    guess: '12A',
    length: 3,
    base: 10,
  },
  {
    guess: '1224',
    length: 4,
    base: 10,
  },
  {
    guess: 'a1a2',
    length: 4,
    base: 16,
  },
  {
    guess: 'aA12',
    length: 4,
    base: 16,
  },
  {
    guess: 'a1G2',
    length: 4,
    base: 16,
  },
];

describe('isValidGuess', () => {
  it.each(validCases)(
    'accepts "$guess" with length $length in base $base',
    ({ guess, length, base }) => {
      expect(isValidGuess(guess, length, base)).toBe(true);
    },
  );

  it.each(invalidCases)(
    'rejects "$guess" with length $length in base $base',
    ({ guess, length, base }) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    },
  );
});
