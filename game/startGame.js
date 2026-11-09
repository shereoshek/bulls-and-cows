import { generateSecret } from './generateSecret.js';
export const startGame = (state, random = Math.random, now = Date.now) => {
    if (state.status !== 'setup' || state.settings.length > state.settings.base) {
        return state;
    }
    const secret = generateSecret(state.settings.length, state.settings.base, random);
    return {
        ...state,
        status: 'playing',
        secret,
        history: [],
        startedAt: now(),
        finishedAt: null,
    };
};
//# sourceMappingURL=startGame.js.map