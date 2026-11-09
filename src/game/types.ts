export type GameBase = 2 | 8 | 10 | 16;

export type GameLength = 2 | 3 | 4 | 5 | 6;

export type GameStatus = 'setup' | 'playing' | 'won';

export type GameSettings = {
  length: GameLength;
  base: GameBase;
};

export type GuessEntry = {
  guess: string;
  bulls: number;
  cows: number;
};

export type GameState = {
  settings: GameSettings;
  status: GameStatus;
  secret: string | null;
  history: GuessEntry[];
  startedAt: number | null;
  finishedAt: number | null;
};

export type GameRecord = {
  settings: GameSettings;
  attempts: number;
  durationMs: number;
  completedAt: number;
};
