import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/game/countPossibleSecrets.js';

const calculationCases = [
  {
    description: 'counts binary combinations',
    length: 2,
    base: 2,
    expected: 2,
  },
  {
    description: 'counts octal combinations',
    length: 3,
    base: 8,
    expected: 336,
  },
  {
    description: 'includes combinations with a leading zero',
    length: 4,
    base: 10,
    expected: 5040,
  },
  {
    description: 'counts hexadecimal combinations',
    length: 4,
    base: 16,
    expected: 43680,
  },
  {
    description: 'returns 1 for zero-length combinations',
    length: 0,
    base: 10,
    expected: 1,
  },
  {
    description: 'returns 0 when length exceeds the base',
    length: 5,
    base: 4,
    expected: 0,
  },
  {
    description: 'counts combinations with a single digit',
    length: 1,
    base: 16,
    expected: 16,
  },
];

describe('countPossibleSecrets', () => {
  it.each(calculationCases)('$description', ({ length, base, expected }) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });
});
