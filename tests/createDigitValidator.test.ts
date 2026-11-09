import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/game/createDigitValidator.js';

const validCases = [
  { base: 2, digit: '0' },
  { base: 2, digit: '1' },
  { base: 8, digit: '0' },
  { base: 8, digit: '7' },
  { base: 10, digit: '0' },
  { base: 10, digit: '9' },
  { base: 16, digit: '0' },
  { base: 16, digit: '9' },
  { base: 16, digit: 'a' },
  { base: 16, digit: 'f' },
];

const invalidCases = [
  { base: 2, digit: '2' },
  { base: 2, digit: '9' },
  { base: 8, digit: '8' },
  { base: 8, digit: '9' },
  { base: 10, digit: 'A' },
  { base: 10, digit: 'a' },
  { base: 16, digit: 'g' },
  { base: 16, digit: 'G' },
];

describe('createDigitValidator', () => {
  it.each(validCases)('accepts digit "$digit" in base $base', ({ base, digit }) => {
    const isValidDigit = createDigitValidator(base);

    expect(isValidDigit(digit)).toBe(true);
  });

  it.each(invalidCases)('rejects digit "$digit" in base $base', ({ base, digit }) => {
    const isValidDigit = createDigitValidator(base);
    expect(isValidDigit(digit)).toBe(false);
  });

  it.each(['A', 'B', 'C', 'D', 'E', 'F'])('accepts uppercase hexadecimal digit "%s"', (digit) => {
    const isHexDigit = createDigitValidator(16);

    expect(isHexDigit(digit)).toBe(true);
  });
  it('rejects empty strings and multiple characters', () => {
    const isHexDigit = createDigitValidator(16);

    expect(isHexDigit('')).toBe(false);
    expect(isHexDigit('ab')).toBe(false);
  });
});
