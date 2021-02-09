import { createAction } from 'typesafe-actions';

export const setCurrentBattle = createAction('@battle/SET_CURRENT_BATTLE')();
export const setCurrentBattleRound = createAction('@battle/SET_CURRENT_BATTLE_ROUND')();
export const setMyUserInfoToCurrentBattle = createAction('@battle/SET_MY_USER_INFO_TO_CURRENT_BATTLE')();
export const setRoundsToCurrentBattle = createAction('@battle/SET_ROUNDS_TO_CURRENT_BATTLE')();
export const setBattlePlayers = createAction('@battle/SET_BATTLE_PLAYERS')();
export const incrementMyTotalScore = createAction('@battle/IMPLEMENT_MY_TOTAL_SCORE')();
export const setMyTotalScore = createAction('@battle/SET_MY_TOTAL_SCORE')();
export const setMyGuessedRounds = createAction('@battle/SET_MY_GUESSED_ROUNDS')();
export const removePlayerFromBattle = createAction('@battle/REMOVE_PLAYER_FROM_BATTLE')();
export const resetCurrentBattle = createAction('@battle/RESET_CURRENT_BATTLE')();
