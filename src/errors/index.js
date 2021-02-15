// eslint-disable-next-line max-classes-per-file
const serializeToJSON = error => {
    const { name, message, stack } = error;
    return {
        error: {
            name,
            message,
            stacktrace: stack,
        },
    };
};

export const errorNames = {
    maxBattleCapacityExhausted: 'MaxBattleCapacityExhaustedError',
    duplicatedBattlePlayer: 'DuplicatedBattlePlayerError',
    notFoundBattlePlayer: 'NotFoundBattlePlayerError',
};

export const MaxBattleCapacityExhaustedError = class MaxBattleCapacityExhaustedError extends Error {
    constructor(message) {
        super(message);
        this.name = errorNames.maxBattleCapacityExhausted;
        this.message = message;
    }

    toJSON() {
        return serializeToJSON(this);
    }
};

export const DuplicatedBattlePlayerError = class DuplicatedBattlePlayerError extends Error {
    constructor(message) {
        super(message);
        this.name = errorNames.duplicatedBattlePlayer;
        this.message = message;
    }

    toJSON() {
        return serializeToJSON(this);
    }
};

export const NotFoundBattlePlayerError = class NotFoundBattlePlayerError extends Error {
    constructor(message) {
        super(message);
        this.name = errorNames.notFoundBattlePlayer;
        this.message = message;
    }

    toJSON() {
        return serializeToJSON(this);
    }
};
