import { getType } from 'typesafe-actions';

import {
    addPanoramaPlaceToCurrentGameRounds,
    setCurrentGame,
    setCurrentMapLayer,
    setTotalRoundCounter,
    setTotalRoundScore,
} from '../actions/game';

export const mapLayers = {
    default: 'default',
    tourist: 'tourist',
};

// rounds type
/*
roundId: null,
lat:
lon:
bestPanoramaPlace: null,
 */

const initialState = {
    currentGame: {
        mode: null,
        round: null,
        totalScore: 0,
        radius: 1,
        city: null,
        regionNutCode: null,
        guessResultMode: null,
        noMove: false,
        currentMapLayer: mapLayers.default,
        rounds: [],
    },
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setCurrentGame): {
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    ...action.payload,
                },
            };
        }
        case getType(setTotalRoundScore):
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    totalScore: action.payload,
                },
            };
        case getType(addPanoramaPlaceToCurrentGameRounds): {
            const currentGameRounds = state.currentGame.rounds;
            currentGameRounds.push(action.payload);
            return {
                ...state,
                currentGame: {
                    ...state.currentGame,
                    rounds: currentGameRounds,
                },
            };
        }
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
