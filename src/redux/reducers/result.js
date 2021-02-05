import { getType } from 'typesafe-actions';

import { setLastResult } from '../actions/result';

const initialState = {
    guessedPoints: [],
    totalScore: 0,
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setLastResult): {
            const { guessedPoints, totalScore } = action.payload;
            return {
                ...state,
                totalScore,
                guessedPoints,
            };
        }
        default:
            return state;
    }
};

export default gameReducer;
