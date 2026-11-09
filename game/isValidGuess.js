import { createDigitValidator } from './createDigitValidator.js';
export const isValidGuess = (guess, length, base) => {
    if (guess.length !== length) {
        return false;
    }
    const isValidDigit = createDigitValidator(base);
    const containsOnlyValidDigits = [...guess].every(isValidDigit);
    const containsUniqueDigits = new Set(guess.toLowerCase()).size === length;
    return containsOnlyValidDigits && containsUniqueDigits;
};
//# sourceMappingURL=isValidGuess.js.map