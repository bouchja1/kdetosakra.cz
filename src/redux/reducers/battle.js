import { getType } from 'typesafe-actions';

import {
    addPlayerToBattle, removePlayerFromBattle, setCurrentBattle, setBattlePlayers
} from '../actions/battle';

const initialState = {
    currentBattle: {
        dateCreatedInSeconds: null, // unix timestamp
        battleId: null,
        createdById: null,
        mode: null,
        round: null,
        rounds: [],
        totalScore: 0,
        isGameFinishedSuccessfully: false,
        isGameActive: false,
        isGameStarted: false,
        players: [],
    },
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setCurrentBattle):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    ...action.payload,
                },
            };
        case getType(setBattlePlayers):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    players: action.payload,
                },
            };
        case getType(addPlayerToBattle): {
            // add to array
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    ...action.payload,
                },
            };
        }
        case getType(removePlayerFromBattle): {
            // find player by ID and remove from array
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    ...action.payload,
                },
            };
        }
        default:
            return state;
    }
};

export default gameReducer;
