const cache = new Map<string, number>();

export const countPossibleSecrets = (length: number, base: number): number => {
  const cacheKey = `${length}:${base}`;
  const cachedResult = cache.get(cacheKey);

  if (cachedResult !== undefined) {
    return cachedResult;
  }

  let result: number;

  if (length === 0) {
    result = 1;
  } else if (length > base) {
    result = 0;
  } else {
    result = base * countPossibleSecrets(length - 1, base - 1);
  }

  cache.set(cacheKey, result);

  return result;
};
