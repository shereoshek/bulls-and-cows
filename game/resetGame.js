import { createInitialGameState } from './createInitialGameState.js';
export const resetGame = (state) => {
    const initialState = createInitialGameState();
    return {
        ...initialState,
        settings: { ...state.settings },
    };
};
//# sourceMappingURL=resetGame.js.map