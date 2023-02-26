import { getType } from 'typesafe-actions';

import { setCurrentGame, setTotalRoundScore, setTotalRoundCounter, setCurrentMapLayer } from '../actions/game';

export const mapLayers = {
    default: 'default',
    tourist: 'tourist'
}

const initialState = {
    currentGame: {
        mode: null,
        round: null,
        totalScore: 0,
        radius: 1,
        city: null,
        regionNutCode: null,
        currentMapLayer: mapLayers.default
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
        case getType(setCurrentMapLayer):
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    currentMapLayer: action.payload,
                },
            };
        default:
            return state;
    }
};

export default gameReducer;
