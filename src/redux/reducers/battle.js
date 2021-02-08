import { getType } from 'typesafe-actions';

import {
    removePlayerFromBattle,
    resetCurrentBattle,
    setCurrentBattle,
    setBattlePlayers,
    setMyUserInfoToCurrentBattle,
    setRoundsToCurrentBattle,
    setCurrentBattleRound,
    setMyTotalScore,
    incrementMyTotalScore,
} from '../actions/battle';

const initialState = {
    currentBattle: {
        dateCreatedInSeconds: null, // unix timestamp
        battleId: null,
        createdById: null,
        mode: null,
        round: null,
        rounds: [],
        myTotalScore: 0,
        myNickname: null,
        isGameFinishedSuccessfully: false,
        isGameStarted: false,
        players: [],
        radius: null,
        withCountdown: true,
        countdown: 60,
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
        case getType(setCurrentBattleRound):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    round: action.payload,
                },
            };
        case getType(setBattlePlayers): {
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    players: action.payload,
                },
            };
        }
        case getType(setMyUserInfoToCurrentBattle):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    myNickname: action.payload.myNickname,
                    myTotalScore: action.payload.myTotalScore,
                    myDocumentId: action.payload.myDocumentId,
                },
            };
        case getType(incrementMyTotalScore):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    myTotalScore: state.currentBattle.myTotalScore + action.payload,
                },
            };
        case getType(setMyTotalScore):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    myTotalScore: action.payload,
                },
            };
        case getType(setRoundsToCurrentBattle):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    rounds: action.payload,
                },
            };
        case getType(resetCurrentBattle):
            return initialState;
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
