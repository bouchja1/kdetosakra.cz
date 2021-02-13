import { getType } from 'typesafe-actions';

import { setLastResult } from '../actions/result';

const initialState = {
    guessedPoints: [],
    totalScore: 0,
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setLastResult): {
            const {
                guessedPoints, totalScore, mode, radius, city,
            } = action.payload;
            return {
                ...state,
                totalScore,
                guessedPoints,
                mode,
                radius,
                city,
            };
        }
        default:
            return state;
    }
};

export default gameReducer;
