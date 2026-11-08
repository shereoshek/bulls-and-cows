import { describe, expect, it, vi } from 'vitest';
import { generateSecret } from '../src/game/generateSecret.js';

const baseCases = [
  {
    base: 2,
    length: 2,
    availableDigits: '01',
  },
  {
    base: 8,
    length: 3,
    availableDigits: '01234567',
  },
  {
    base: 10,
    length: 4,
    availableDigits: '0123456789',
  },
  {
    base: 16,
    length: 4,
    availableDigits: '0123456789abcdef',
  },
];

describe('generateSecret', () => {
  it.each(baseCases)(
    'returns $length unique digits in base $base',
    ({ base, length, availableDigits }) => {
      const secret = generateSecret(length, base, () => 0.999999);
      const secretDigits = [...secret];

      expect(secret).toHaveLength(length);
      expect(new Set(secretDigits).size).toBe(length);
      expect(secretDigits.every((digit) => availableDigits.includes(digit))).toBe(true);
    },
  );

  it('preserves leading zeros', () => {
    const random = vi.fn(() => 0.999999);

    const secret = generateSecret(4, 10, random);

    expect(secret).toBe('0123');
    expect(random).toHaveBeenCalled();
  });

  it('uses Math.random as the default random source', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toHaveLength(4);
    expect(new Set(secret).size).toBe(4);

    expect([...secret].every((digit) => '0123456789'.includes(digit))).toBe(true);
  });
});
