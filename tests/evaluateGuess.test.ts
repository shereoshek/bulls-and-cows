import { describe, expect, it } from 'vitest';
import { evaluateGuess } from '../src/game/evaluateGuess.js';

const comparisonCases = [
  {
    description: 'returns 4 bulls and 0 cows for an exact match',
    secret: '4271',
    guess: '4271',
    expected: { bulls: 4, cows: 0 },
  },
  {
    description: 'returns 0 bulls and 4 cows when all digits are in wrong positions',
    secret: '4271',
    guess: '1742',
    expected: { bulls: 0, cows: 4 },
  },
  {
    description: 'returns 2 bulls and 2 cows for a mixed result',
    secret: '5831',
    guess: '1835',
    expected: { bulls: 2, cows: 2 },
  },
  {
    description: 'returns 0 bulls and 0 cows when there are no matching digits',
    secret: '4271',
    guess: '8053',
    expected: { bulls: 0, cows: 0 },
  },
  {
    description: 'returns only bulls when matching digits are in correct positions',
    secret: '4271',
    guess: '4285',
    expected: { bulls: 2, cows: 0 },
  },
  {
    description: 'compares hexadecimal digits without case sensitivity',
    secret: 'a1b2',
    guess: 'B2A1',
    expected: { bulls: 0, cows: 4 },
  },
  {
    description: 'recognizes hexadecimal bulls regardless of letter case',
    secret: 'a1b2',
    guess: 'A1B2',
    expected: { bulls: 4, cows: 0 },
  },
];

describe('evaluateGuess', () => {
  it.each(comparisonCases)('$description', ({ secret, guess, expected }) => {
    expect(evaluateGuess(secret, guess)).toEqual(expected);
  });
});
