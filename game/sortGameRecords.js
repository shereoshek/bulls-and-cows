export const sortGameRecords = (records, limit = 10) => {
    return [...records]
        .sort((first, second) => first.attempts - second.attempts || first.durationMs - second.durationMs)
        .slice(0, limit);
};
//# sourceMappingURL=sortGameRecords.js.map