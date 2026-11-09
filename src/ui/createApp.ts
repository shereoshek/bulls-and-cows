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

  const header = createElement('header', 'app-header');
  const eyebrow = createElement('p', 'app-eyebrow', 'LOGIC GAME');
  const title = createElement('h1', 'app-title', 'Bulls & Cows');
  const description = createElement(
    'p',
    'app-description',
    'Угадай секретную комбинацию из уникальных символов.',
  );

  header.append(eyebrow, title, description);

  const setupSection = createElement('section', 'setup-card');
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

  startButton.type = 'button';

  setupSection.append(setupTitle, setupDescription, settingsGrid, startButton);

  app.append(header, setupSection);

  return app;
};
