import { createInitialGameState } from './game/createInitialGameState.js';
import { startGame } from './game/startGame.js';
import { updateGameSettings } from './game/updateGameSettings.js';
import type { GameBase, GameLength } from './game/types.js';
import { createApp } from './ui/createApp.js';

const app = createApp();

document.body.prepend(app);

let gameState = createInitialGameState();

const baseSelect = document.querySelector<HTMLSelectElement>('#base-select');
const lengthSelect = document.querySelector<HTMLSelectElement>('#length-select');

const startButton = document.querySelector<HTMLButtonElement>('#start-button');

const setupSection = document.querySelector<HTMLElement>('#setup-section');
const gameSection = document.querySelector<HTMLElement>('#game-section');

if (!baseSelect || !lengthSelect || !startButton || !setupSection || !gameSection) {
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
});

renderSettings();
