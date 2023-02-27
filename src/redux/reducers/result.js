import { getType } from 'typesafe-actions';

import { setLastResult } from '../actions/result';

const initialState = {
    guessedPoints: [],
    totalScore: 0,
};

const resultReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setLastResult): {
            return {
                ...state,
                ...action.payload,
            };
        }
        default:
            return state;
    }
};

export default resultReducer;
