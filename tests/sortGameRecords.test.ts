import { describe, expect, it } from 'vitest';
import { sortGameRecords } from '../src/game/sortGameRecords.js';
import type { GameRecord } from '../src/game/types.js';

const createRecord = (attempts: number, durationMs: number, completedAt = 1000): GameRecord => ({
  settings: {
    length: 4,
    base: 10,
  },
  attempts,
  durationMs,
  completedAt,
});

describe('sortGameRecords', () => {
  it('sorts records by attempts in ascending order', () => {
    const records = [createRecord(5, 20000), createRecord(2, 30000), createRecord(4, 15000)];

    const result = sortGameRecords(records);

    expect(result.map((record) => record.attempts)).toEqual([2, 4, 5]);
  });

  it('sorts records by duration when attempts are equal', () => {
    const records = [createRecord(3, 30000), createRecord(3, 15000), createRecord(3, 25000)];

    const result = sortGameRecords(records);

    expect(result.map((record) => record.durationMs)).toEqual([15000, 25000, 30000]);
  });

  it('returns only the top 10 records by default', () => {
    const records = Array.from({ length: 15 }, (_, index) => createRecord(index + 1, 10000));

    expect(sortGameRecords(records)).toHaveLength(10);
  });

  it('supports a custom limit', () => {
    const records = [
      createRecord(5, 20000),
      createRecord(2, 30000),
      createRecord(4, 15000),
      createRecord(1, 10000),
    ];

    const result = sortGameRecords(records, 2);

    expect(result).toHaveLength(2);
    expect(result.map((record) => record.attempts)).toEqual([1, 2]);
  });

  it('does not mutate the original records array', () => {
    const records = [createRecord(5, 20000), createRecord(2, 30000), createRecord(4, 15000)];

    const originalRecords = [...records];

    const result = sortGameRecords(records);

    expect(records).toEqual(originalRecords);
    expect(result).not.toBe(records);
  });

  it('returns an empty array when there are no records', () => {
    expect(sortGameRecords([])).toEqual([]);
  });
});
