import { sortGameRecords } from './sortGameRecords.js';
export const GAME_RECORDS_STORAGE_KEY = 'bulls-and-cows-records';
const isGameRecord = (value) => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const candidate = value;
    const settings = candidate.settings;
    if (typeof settings !== 'object' || settings === null) {
        return false;
    }
    const candidateSettings = settings;
    const base = candidateSettings.base;
    const length = candidateSettings.length;
    const isValidBase = typeof base === 'number' && [2, 8, 10, 16].includes(base);
    const isValidLength = typeof length === 'number' && Number.isInteger(length) && length >= 2 && length <= 6;
    return (isValidBase &&
        isValidLength &&
        length <= base &&
        typeof candidate.attempts === 'number' &&
        Number.isInteger(candidate.attempts) &&
        candidate.attempts > 0 &&
        typeof candidate.durationMs === 'number' &&
        Number.isFinite(candidate.durationMs) &&
        candidate.durationMs >= 0 &&
        typeof candidate.completedAt === 'number' &&
        Number.isFinite(candidate.completedAt) &&
        candidate.completedAt >= 0);
};
export const loadGameRecords = (storage = window.localStorage) => {
    const storedRecords = storage.getItem(GAME_RECORDS_STORAGE_KEY);
    if (storedRecords === null) {
        return [];
    }
    try {
        const parsedRecords = JSON.parse(storedRecords);
        if (!Array.isArray(parsedRecords)) {
            return [];
        }
        const validRecords = parsedRecords.filter(isGameRecord);
        return sortGameRecords(validRecords);
    }
    catch {
        return [];
    }
};
export const saveGameRecord = (record, storage = window.localStorage) => {
    const existingRecords = loadGameRecords(storage);
    const updatedRecords = sortGameRecords([...existingRecords, record]);
    storage.setItem(GAME_RECORDS_STORAGE_KEY, JSON.stringify(updatedRecords));
    return updatedRecords;
};
//# sourceMappingURL=gameRecordsStorage.js.map