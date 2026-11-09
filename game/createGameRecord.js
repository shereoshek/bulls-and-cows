export const createGameRecord = (state) => {
    if (state.status !== 'won' || state.startedAt === null || state.finishedAt === null) {
        return null;
    }
    return {
        settings: { ...state.settings },
        attempts: state.history.length,
        durationMs: state.finishedAt - state.startedAt,
        completedAt: state.finishedAt,
    };
};
//# sourceMappingURL=createGameRecord.js.map