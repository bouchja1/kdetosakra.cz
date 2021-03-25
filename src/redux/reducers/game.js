import { getType } from 'typesafe-actions';

import { setCurrentGame, setTotalRoundScore, setTotalRoundCounter } from '../actions/game';

const initialState = {
    currentGame: {
        mode: null,
        round: null,
        totalScore: 0,
        radius: 1,
        city: null,
        regionNutCode: null,
    },
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setCurrentGame):
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    ...action.payload,
                },
            };
        case getType(setTotalRoundScore):
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    totalScore: action.payload,
                },
            };
        case getType(setTotalRoundCounter):
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    round: action.payload,
                },
            };
        default:
            return state;
    }
};

export default gameReducer;
