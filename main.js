import { createDigitValidator } from './game/createDigitValidator.js';
import { createGameRecord } from './game/createGameRecord.js';
import { createInitialGameState } from './game/createInitialGameState.js';
import { isValidGuess } from './game/isValidGuess.js';
import { loadGameRecords, saveGameRecord } from './game/gameRecordsStorage.js';
import { resetGame } from './game/resetGame.js';
import { startGame } from './game/startGame.js';
import { submitGuess } from './game/submitGuess.js';
import { updateGameSettings } from './game/updateGameSettings.js';
import { createApp } from './ui/createApp.js';
import { countPossibleSecrets } from './game/countPossibleSecrets.js';
const app = createApp();
document.body.prepend(app);
let gameState = createInitialGameState();
let gameRecords = [];
let timerInterval = null;
// Загружаем рекорды при открытии приложения.
try {
    gameRecords = loadGameRecords();
}
catch {
    gameRecords = [];
}
const baseSelect = document.querySelector('#base-select');
const lengthSelect = document.querySelector('#length-select');
const startButton = document.querySelector('#start-button');
const setupSection = document.querySelector('#setup-section');
const gameSection = document.querySelector('#game-section');
const guessForm = document.querySelector('#guess-form');
const guessInput = document.querySelector('#guess-input');
const submitButton = document.querySelector('#submit-guess-button');
const guessFeedback = document.querySelector('#guess-feedback');
const attemptsCount = document.querySelector('#attempts-count');
const timerValue = document.querySelector('#timer-value');
const historyList = document.querySelector('#history-list');
const gameTitle = document.querySelector('#game-title');
const gameDescription = document.querySelector('.game-description');
const newGameButton = document.querySelector('#new-game-button');
const leaderboardEmpty = document.querySelector('#leaderboard-empty');
const leaderboardTable = document.querySelector('#leaderboard-table');
const leaderboardBody = document.querySelector('#leaderboard-body');
const possibilitiesCount = document.querySelector('#possibilities-count');
if (!baseSelect ||
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
    !gameDescription ||
    !newGameButton ||
    !leaderboardEmpty ||
    !leaderboardTable ||
    !possibilitiesCount ||
    !leaderboardBody) {
    throw new Error('Required application elements were not found.');
}
const baseLabels = {
    2: 'BIN',
    8: 'OCT',
    10: 'DEC',
    16: 'HEX',
};
const isGameBase = (value) => value === 2 || value === 8 || value === 10 || value === 16;
const isGameLength = (value) => Number.isInteger(value) && value >= 2 && value <= 6;
const renderSettings = () => {
    baseSelect.value = String(gameState.settings.base);
    lengthSelect.value = String(gameState.settings.length);
    Array.from(lengthSelect.options).forEach((option) => {
        option.disabled = Number(option.value) > gameState.settings.base;
    });
    const possibleSecrets = countPossibleSecrets(gameState.settings.length, gameState.settings.base);
    possibilitiesCount.textContent = `Возможных секретных комбинаций: ${new Intl.NumberFormat('ru-RU').format(possibleSecrets)}`;
};
const showFeedback = (message) => {
    guessFeedback.textContent = message;
    guessFeedback.hidden = false;
};
const clearFeedback = () => {
    guessFeedback.textContent = '';
    guessFeedback.hidden = true;
};
const renderAttemptsCount = () => {
    attemptsCount.textContent = `Попыток: ${gameState.history.length}`;
};
const renderHistory = () => {
    const entries = [...gameState.history].reverse().map((entry) => {
        const item = document.createElement('li');
        item.textContent = `${entry.guess.toUpperCase()} — Быки: ${entry.bulls}, коровы: ${entry.cows}`;
        return item;
    });
    historyList.replaceChildren(...entries);
};
const formatDuration = (durationMs) => {
    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const formatCompletedAt = (timestamp) => new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
}).format(new Date(timestamp));
const renderLeaderboard = () => {
    const rows = gameRecords.map((record, index) => {
        const row = document.createElement('tr');
        const values = [
            String(index + 1),
            `${baseLabels[record.settings.base]} · ${record.settings.length}`,
            String(record.attempts),
            formatDuration(record.durationMs),
            formatCompletedAt(record.completedAt),
        ];
        values.forEach((value) => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.append(cell);
        });
        return row;
    });
    leaderboardBody.replaceChildren(...rows);
    const hasRecords = gameRecords.length > 0;
    leaderboardEmpty.hidden = hasRecords;
    leaderboardTable.hidden = !hasRecords;
};
const renderTimer = () => {
    if (gameState.startedAt === null) {
        return;
    }
    const endTime = gameState.finishedAt ?? Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((endTime - gameState.startedAt) / 1000));
    const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const seconds = String(elapsedSeconds % 60).padStart(2, '0');
    timerValue.textContent = `Время: ${minutes}:${seconds}`;
};
const stopTimer = () => {
    if (timerInterval !== null) {
        window.clearInterval(timerInterval);
        timerInterval = null;
    }
};
// Изменение системы счисления.
baseSelect.addEventListener('change', () => {
    const base = Number(baseSelect.value);
    if (!isGameBase(base)) {
        renderSettings();
        return;
    }
    const length = base === 2 ? 2 : gameState.settings.length;
    gameState = updateGameSettings(gameState, {
        base,
        length,
    });
    renderSettings();
});
// Изменение длины комбинации.
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
// Фильтрация символов при вводе.
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
// Запуск игрового раунда.
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
    clearFeedback();
    timerInterval = window.setInterval(renderTimer, 1000);
    guessInput.focus();
});
// Отправка попытки.
guessForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = guessInput.value;
    if (!isValidGuess(guess, gameState.settings.length, gameState.settings.base)) {
        showFeedback(`Введи ${gameState.settings.length} уникальных допустимых символа.`);
        return;
    }
    const normalizedGuess = guess.toLowerCase();
    const isDuplicate = gameState.history.some((entry) => entry.guess.toLowerCase() === normalizedGuess);
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
    // Если игрок победил, сохраняем рекорд.
    if (gameState.status === 'won') {
        stopTimer();
        renderTimer();
        guessInput.disabled = true;
        submitButton.disabled = true;
        gameTitle.textContent = 'Победа!';
        gameDescription.textContent =
            `Ты угадала комбинацию ${gameState.secret?.toUpperCase()} за ` +
                `${gameState.history.length} попыток.`;
        const record = createGameRecord(gameState);
        if (record !== null) {
            try {
                gameRecords = saveGameRecord(record);
                renderLeaderboard();
            }
            catch {
                showFeedback('Победа засчитана, но не удалось сохранить рекорд в браузере.');
            }
        }
        return;
    }
    guessInput.focus();
});
// Возврат к настройкам без перезагрузки.
newGameButton.addEventListener('click', () => {
    stopTimer();
    gameState = resetGame(gameState);
    baseSelect.disabled = false;
    lengthSelect.disabled = false;
    startButton.disabled = false;
    guessInput.disabled = false;
    submitButton.disabled = false;
    guessInput.value = '';
    setupSection.hidden = false;
    gameSection.hidden = true;
    gameTitle.textContent = 'Игра началась';
    gameDescription.textContent = 'Секретная комбинация загадана. Попробуй её угадать.';
    attemptsCount.textContent = 'Попыток: 0';
    timerValue.textContent = 'Время: 00:00';
    historyList.replaceChildren();
    clearFeedback();
    renderSettings();
});
// Первоначальное отображение настроек и сохранённых рекордов.
renderSettings();
renderLeaderboard();
//# sourceMappingURL=main.js.map