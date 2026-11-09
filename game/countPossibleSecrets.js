const cache = new Map();
export const countPossibleSecrets = (length, base) => {
    const cacheKey = `${length}:${base}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult !== undefined) {
        return cachedResult;
    }
    let result;
    if (length === 0) {
        result = 1;
    }
    else if (length > base) {
        result = 0;
    }
    else {
        result = base * countPossibleSecrets(length - 1, base - 1);
    }
    cache.set(cacheKey, result);
    return result;
};
//# sourceMappingURL=countPossibleSecrets.js.map