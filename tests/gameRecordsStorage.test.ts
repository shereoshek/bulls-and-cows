import { describe, expect, it, vi } from 'vitest';
import {
  GAME_RECORDS_STORAGE_KEY,
  loadGameRecords,
  saveGameRecord,
} from '../src/game/gameRecordsStorage.js';
import type { GameRecord } from '../src/game/types.js';

const createRecord = (
  attempts: number,
  durationMs: number,
  base: GameRecord['settings']['base'] = 10,
  length: GameRecord['settings']['length'] = 4,
): GameRecord => ({
  settings: { length, base },
  attempts,
  durationMs,
  completedAt: 1000,
});

const createStorage = (initialValue: string | null = null) => {
  const values = new Map<string, string>();

  if (initialValue !== null) {
    values.set(GAME_RECORDS_STORAGE_KEY, initialValue);
  }

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
};

describe('loadGameRecords', () => {
  it('returns an empty array when storage has no records', () => {
    const storage = createStorage();

    expect(loadGameRecords(storage)).toEqual([]);
  });

  it('loads and sorts saved records', () => {
    const records = [createRecord(5, 20000), createRecord(2, 30000), createRecord(3, 15000)];

    const storage = createStorage(JSON.stringify(records));

    expect(loadGameRecords(storage)).toEqual([records[1], records[2], records[0]]);
  });

  it('returns an empty array when stored JSON is corrupted', () => {
    const storage = createStorage('{invalid json');

    expect(loadGameRecords(storage)).toEqual([]);
  });

  it('ignores invalid records in stored data', () => {
    const records = [
      createRecord(3, 15000),
      {
        settings: { length: 4, base: 2 },
        attempts: 0,
        durationMs: -100,
        completedAt: 1000,
      },
    ];

    const storage = createStorage(JSON.stringify(records));

    expect(loadGameRecords(storage)).toEqual([records[0]]);
  });
});

describe('saveGameRecord', () => {
  it('adds a record and saves the sorted results', () => {
    const existingRecords = [createRecord(4, 20000), createRecord(3, 30000)];

    const newRecord = createRecord(2, 25000);
    const storage = createStorage(JSON.stringify(existingRecords));

    const result = saveGameRecord(newRecord, storage);

    expect(result.map((record) => record.attempts)).toEqual([2, 3, 4]);

    expect(storage.setItem).toHaveBeenCalledWith(GAME_RECORDS_STORAGE_KEY, JSON.stringify(result));
  });

  it('keeps only the top 10 records', () => {
    const existingRecords = Array.from({ length: 10 }, (_, index) =>
      createRecord(index + 1, 10000),
    );

    const storage = createStorage(JSON.stringify(existingRecords));
    const newRecord = createRecord(11, 10000);

    const result = saveGameRecord(newRecord, storage);

    expect(result).toHaveLength(10);
    expect(result.every((record) => record.attempts <= 10)).toBe(true);
  });

  it('saves a new record when existing JSON is corrupted', () => {
    const storage = createStorage('{invalid json');
    const newRecord = createRecord(2, 15000);

    const result = saveGameRecord(newRecord, storage);

    expect(result).toEqual([newRecord]);
    expect(storage.setItem).toHaveBeenCalledOnce();
  });
});
