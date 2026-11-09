type SelectOption = {
  value: string;
  label: string;
};

const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tagName: Tag,
  className: string,
  text?: string,
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tagName);

  element.className = className;

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
};

const createSelectField = (
  id: string,
  labelText: string,
  options: SelectOption[],
  selectedValue: string,
): HTMLDivElement => {
  const field = createElement('div', 'form-field');

  const label = createElement('label', 'form-label', labelText);
  label.htmlFor = id;

  const select = createElement('select', 'form-select');
  select.id = id;
  select.name = id;

  options.forEach(({ value, label: optionLabel }) => {
    const option = createElement('option', '', optionLabel);
    option.value = value;
    select.append(option);
  });

  select.value = selectedValue;

  field.append(label, select);

  return field;
};

export const createApp = (): HTMLElement => {
  const app = createElement('main', 'app-shell');

  // Header
  const header = createElement('header', 'app-header');
  const eyebrow = createElement('p', 'app-eyebrow', 'LOGIC GAME');
  const title = createElement('h1', 'app-title', 'Bulls & Cows');
  const description = createElement(
    'p',
    'app-description',
    'Угадай секретную комбинацию из уникальных символов.',
  );

  header.append(eyebrow, title, description);

  // Settings screen
  const setupSection = createElement('section', 'setup-card');
  setupSection.id = 'setup-section';
  setupSection.setAttribute('aria-labelledby', 'setup-title');

  const setupTitle = createElement('h2', 'setup-title', 'Новая игра');
  setupTitle.id = 'setup-title';

  const setupDescription = createElement(
    'p',
    'setup-description',
    'Выбери параметры секретной комбинации.',
  );

  const settingsGrid = createElement('div', 'settings-grid');

  const baseField = createSelectField(
    'base-select',
    'Система счисления',
    [
      { value: '2', label: 'BIN — двоичная' },
      { value: '8', label: 'OCT — восьмеричная' },
      { value: '10', label: 'DEC — десятичная' },
      { value: '16', label: 'HEX — шестнадцатеричная' },
    ],
    '10',
  );

  const lengthField = createSelectField(
    'length-select',
    'Длина комбинации',
    [
      { value: '2', label: '2 символа' },
      { value: '3', label: '3 символа' },
      { value: '4', label: '4 символа' },
      { value: '5', label: '5 символов' },
      { value: '6', label: '6 символов' },
    ],
    '4',
  );

  settingsGrid.append(baseField, lengthField);

  const startButton = createElement('button', 'start-button', 'Начать игру');
  startButton.id = 'start-button';
  startButton.type = 'button';

  setupSection.append(setupTitle, setupDescription, settingsGrid, startButton);

  // Game screen
  const gameSection = createElement('section', 'game-card');
  gameSection.id = 'game-section';
  gameSection.hidden = true;
  gameSection.setAttribute('aria-labelledby', 'game-title');

  const gameTitle = createElement('h2', 'game-title', 'Игра началась');
  gameTitle.id = 'game-title';

  const gameDescription = createElement(
    'p',
    'game-description',
    'Секретная комбинация загадана. Попробуй её угадать.',
  );

  const gameStats = createElement('div', 'game-stats');

  const attemptsCount = createElement('p', 'game-stat', 'Попыток: 0');
  attemptsCount.id = 'attempts-count';

  const timerValue = createElement('p', 'game-stat', 'Время: 00:00');
  timerValue.id = 'timer-value';

  const guessForm = createElement('form', 'guess-form');
  guessForm.id = 'guess-form';

  const guessLabel = createElement('label', 'form-label', 'Твоя комбинация');
  guessLabel.htmlFor = 'guess-input';

  const guessInput = createElement('input', 'guess-input');
  guessInput.id = 'guess-input';
  guessInput.name = 'guess';
  guessInput.type = 'text';
  guessInput.inputMode = 'text';
  guessInput.autocomplete = 'off';
  guessInput.autocapitalize = 'characters';
  guessInput.spellcheck = false;
  guessInput.required = true;
  guessInput.maxLength = 6;
  guessInput.placeholder = 'Введи комбинацию';

  const submitButton = createElement('button', 'submit-button', 'Проверить');
  submitButton.id = 'submit-guess-button';
  submitButton.type = 'submit';

  const guessFeedback = createElement('p', 'guess-feedback');
  guessFeedback.id = 'guess-feedback';
  guessFeedback.hidden = true;
  guessFeedback.setAttribute('role', 'status');
  guessFeedback.setAttribute('aria-live', 'polite');

  guessForm.append(guessLabel, guessInput, submitButton, guessFeedback);

  const historyTitle = createElement('h3', 'history-title', 'История попыток');

  const historyList = createElement('ol', 'history-list');
  historyList.id = 'history-list';
  historyList.setAttribute('aria-live', 'polite');

  const newGameButton = createElement('button', 'new-game-button', 'Новая игра');
  newGameButton.id = 'new-game-button';
  newGameButton.type = 'button';

  gameStats.append(attemptsCount, timerValue);

  gameSection.append(
    gameTitle,
    gameDescription,
    gameStats,
    guessForm,
    historyTitle,
    historyList,
    newGameButton,
  );

  // Leaderboard
  const leaderboardSection = createElement('section', 'leaderboard-card');
  leaderboardSection.id = 'leaderboard-section';
  leaderboardSection.setAttribute('aria-labelledby', 'leaderboard-title');

  const leaderboardTitle = createElement('h2', 'leaderboard-title', 'Таблица рекордов');
  leaderboardTitle.id = 'leaderboard-title';

  const leaderboardDescription = createElement(
    'p',
    'leaderboard-description',
    'Твои десять лучших результатов.',
  );

  const leaderboardEmpty = createElement(
    'p',
    'leaderboard-empty',
    'Пока рекордов нет. Победи в игре, чтобы попасть в таблицу!',
  );
  leaderboardEmpty.id = 'leaderboard-empty';

  const leaderboardTableWrapper = createElement('div', 'leaderboard-table-wrapper');

  const leaderboardTable = createElement('table', 'leaderboard-table');
  leaderboardTable.id = 'leaderboard-table';
  leaderboardTable.hidden = true;

  const tableHead = createElement('thead', 'leaderboard-head');
  const headerRow = createElement('tr', 'leaderboard-header-row');

  ['Место', 'Настройки', 'Попытки', 'Время', 'Дата'].forEach((labelText) => {
    const cell = createElement('th', '', labelText);
    cell.scope = 'col';
    headerRow.append(cell);
  });

  tableHead.append(headerRow);

  const leaderboardBody = createElement('tbody', 'leaderboard-body');
  leaderboardBody.id = 'leaderboard-body';

  leaderboardTable.append(tableHead, leaderboardBody);
  leaderboardTableWrapper.append(leaderboardTable);

  leaderboardSection.append(
    leaderboardTitle,
    leaderboardDescription,
    leaderboardEmpty,
    leaderboardTableWrapper,
  );

  app.append(header, setupSection, gameSection, leaderboardSection);

  return app;
};
