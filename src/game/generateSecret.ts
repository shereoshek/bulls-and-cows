export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  const digits = '0123456789abcdef'.slice(0, base).split('');

  for (let index = digits.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));

    const currentDigit = digits[index]!;
    digits[index] = digits[randomIndex]!;
    digits[randomIndex] = currentDigit;
  }

  return digits.slice(0, length).join('');
};
