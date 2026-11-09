import type { GameRecord } from './types.js';

type RecordStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const GAME_RECORDS_STORAGE_KEY = 'bulls-and-cows-records';

export const loadGameRecords = (storage: RecordStorage = window.localStorage): GameRecord[] => {
  void storage;

  throw new Error('Not implemented');
};

export const saveGameRecord = (
  record: GameRecord,
  storage: RecordStorage = window.localStorage,
): GameRecord[] => {
  void record;
  void storage;

  throw new Error('Not implemented');
};
