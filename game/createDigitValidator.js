export const createDigitValidator = (base) => {
    const allowedDigits = '0123456789abcdef'.slice(0, base);
    return (char) => char.length === 1 && allowedDigits.includes(char.toLowerCase());
};
//# sourceMappingURL=createDigitValidator.js.map