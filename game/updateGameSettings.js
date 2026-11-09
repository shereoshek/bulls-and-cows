export const updateGameSettings = (state, settings) => {
    if (state.status !== 'setup' || settings.length > settings.base) {
        return state;
    }
    return {
        ...state,
        settings: { ...settings },
    };
};
//# sourceMappingURL=updateGameSettings.js.map