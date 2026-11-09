import type { GameRecord } from './types.js';

export const sortGameRecords = (records: readonly GameRecord[], limit = 10): GameRecord[] => {
  return [...records]
    .sort(
      (first, second) => first.attempts - second.attempts || first.durationMs - second.durationMs,
    )
    .slice(0, limit);
};
