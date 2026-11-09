import { createDigitValidator } from './game/createDigitValidator.js';
import { createInitialGameState } from './game/createInitialGameState.js';
import { isValidGuess } from './game/isValidGuess.js';
import { startGame } from './game/startGame.js';
import { submitGuess } from './game/submitGuess.js';
import { updateGameSettings } from './game/updateGameSettings.js';
import type { GameBase, GameLength } from './game/types.js';
import { createApp } from './ui/createApp.js';

const app = createApp();

document.body.prepend(app);

let gameState = createInitialGameState();
let timerInterval: number | null = null;

const baseSelect = document.querySelector<HTMLSelectElement>('#base-select');
const lengthSelect = document.querySelector<HTMLSelectElement>('#length-select');

const startButton = document.querySelector<HTMLButtonElement>('#start-button');
const setupSection = document.querySelector<HTMLElement>('#setup-section');
const gameSection = document.querySelector<HTMLElement>('#game-section');

const guessForm = document.querySelector<HTMLFormElement>('#guess-form');
const guessInput = document.querySelector<HTMLInputElement>('#guess-input');
const submitButton = document.querySelector<HTMLButtonElement>('#submit-guess-button');
const guessFeedback = document.querySelector<HTMLParagraphElement>('#guess-feedback');

const attemptsCount = document.querySelector<HTMLParagraphElement>('#attempts-count');
const timerValue = document.querySelector<HTMLParagraphElement>('#timer-value');
const historyList = document.querySelector<HTMLOListElement>('#history-list');

const gameTitle = document.querySelector<HTMLHeadingElement>('#game-title');
const gameDescription = document.querySelector<HTMLParagraphElement>('.game-description');

if (
  !baseSelect ||
  !lengthSelect ||
  !startButton ||
  !setupSection ||
  !gameSection ||
  !guessForm ||
  !guessInput ||
  !submitButton ||
  !guessFeedback ||
  !attemptsCount ||
  !timerValue ||
  !historyList ||
  !gameTitle ||
  !gameDescription
) {
  throw new Error('Required application elements were not found.');
}

const isGameBase = (value: number): value is GameBase =>
  value === 2 || value === 8 || value === 10 || value === 16;

const isGameLength = (value: number): value is GameLength =>
  Number.isInteger(value) && value >= 2 && value <= 6;

const renderSettings = (): void => {
  baseSelect.value = String(gameState.settings.base);
  lengthSelect.value = String(gameState.settings.length);

  Array.from(lengthSelect.options).forEach((option) => {
    option.disabled = Number(option.value) > gameState.settings.base;
  });
};

const showFeedback = (message: string): void => {
  guessFeedback.textContent = message;
  guessFeedback.hidden = false;
};

const clearFeedback = (): void => {
  guessFeedback.textContent = '';
  guessFeedback.hidden = true;
};

const renderAttemptsCount = (): void => {
  attemptsCount.textContent = `Попыток: ${gameState.history.length}`;
};

const renderHistory = (): void => {
  const entries = gameState.history.map((entry) => {
    const item = document.createElement('li');

    item.textContent = `${entry.guess.toUpperCase()} — Быки: ${entry.bulls}, коровы: ${entry.cows}`;

    return item;
  });

  historyList.replaceChildren(...entries);
};

const renderTimer = (): void => {
  if (gameState.startedAt === null) {
    return;
  }

  const endTime = gameState.finishedAt ?? Date.now();

  const elapsedSeconds = Math.max(0, Math.floor((endTime - gameState.startedAt) / 1000));

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const seconds = String(elapsedSeconds % 60).padStart(2, '0');

  timerValue.textContent = `Время: ${minutes}:${seconds}`;
};

const stopTimer = (): void => {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
};

baseSelect.addEventListener('change', () => {
  const base = Number(baseSelect.value);

  if (!isGameBase(base)) {
    renderSettings();
    return;
  }

  const length: GameLength = base === 2 ? 2 : gameState.settings.length;

  gameState = updateGameSettings(gameState, {
    base,
    length,
  });

  renderSettings();
});

lengthSelect.addEventListener('change', () => {
  const length = Number(lengthSelect.value);

  if (!isGameLength(length)) {
    renderSettings();
    return;
  }

  gameState = updateGameSettings(gameState, {
    base: gameState.settings.base,
    length,
  });

  renderSettings();
});

guessInput.addEventListener('input', () => {
  const isAllowedDigit = createDigitValidator(gameState.settings.base);

  const filteredValue = Array.from(guessInput.value)
    .filter(isAllowedDigit)
    .slice(0, gameState.settings.length)
    .join('');

  if (filteredValue !== guessInput.value) {
    guessInput.value = filteredValue;
    showFeedback('Недопустимые символы удалены.');
  }
});

startButton.addEventListener('click', () => {
  const startedState = startGame(gameState);

  if (startedState === gameState) {
    return;
  }

  gameState = startedState;

  baseSelect.disabled = true;
  lengthSelect.disabled = true;
  startButton.disabled = true;

  setupSection.hidden = true;
  gameSection.hidden = false;

  guessInput.maxLength = gameState.settings.length;
  guessInput.disabled = false;
  submitButton.disabled = false;
  guessInput.value = '';

  renderAttemptsCount();
  renderHistory();
  renderTimer();

  timerInterval = window.setInterval(renderTimer, 1000);

  guessInput.focus();
});

guessForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const guess = guessInput.value;

  if (!isValidGuess(guess, gameState.settings.length, gameState.settings.base)) {
    showFeedback(`Введи ${gameState.settings.length} уникальных допустимых символа.`);
    return;
  }

  const normalizedGuess = guess.toLowerCase();

  const isDuplicate = gameState.history.some(
    (entry) => entry.guess.toLowerCase() === normalizedGuess,
  );

  if (isDuplicate) {
    showFeedback('Ты уже пробовала эту комбинацию.');
    return;
  }

  const updatedState = submitGuess(gameState, guess);

  if (updatedState === gameState) {
    return;
  }

  gameState = updatedState;

  renderAttemptsCount();
  renderHistory();

  guessInput.value = '';
  clearFeedback();

  if (gameState.status === 'won') {
    stopTimer();
    renderTimer();

    guessInput.disabled = true;
    submitButton.disabled = true;

    gameTitle.textContent = 'Победа!';

    gameDescription.textContent =
      `Ты угадала комбинацию ${gameState.secret?.toUpperCase()} за ` +
      `${gameState.history.length} попыток.`;

    return;
  }

  guessInput.focus();
});

renderSettings();
