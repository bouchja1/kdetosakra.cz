import { getType } from 'typesafe-actions';

import {
    removePlayerFromBattle,
    resetCurrentBattle,
    setCurrentBattle,
    setBattlePlayers,
    setMyUserInfoToCurrentBattle,
    setRoundsToCurrentBattle,
    incrementMyTotalScore,
    setIsRoundActive,
    setMyUserInfoNicknameToCurrentBattle,
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
        currentRoundStart: null,
        myNickname: null,
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
        case getType(setMyUserInfoNicknameToCurrentBattle): {
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    myNickname: action.payload,
                },
            };
        }
        case getType(incrementMyTotalScore):
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    myTotalScore: state.currentBattle.myTotalScore + action.payload,
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
        case getType(setIsRoundActive): {
            // payload = { roundId, active = true|false }
            return {
                ...state,
                currentBattle: {
                    ...state.currentBattle,
                    rounds: state.currentBattle.rounds.map(round => {
                        const { roundId } = round;
                        if (roundId === action.payload.roundId) {
                            return {
                                ...round,
                                isRoundActive: action.payload.active,
                            };
                        }
                        return round;
                    }),
                },
            };
        }
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
