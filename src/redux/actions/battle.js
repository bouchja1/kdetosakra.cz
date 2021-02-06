import { createAction } from 'typesafe-actions';

export const setCurrentBattle = createAction('@battle/SET_CURRENT_BATTLE')();
export const setMyUserInfoToCurrentBattle = createAction('@battle/SET_MY_USER_INFO_TO_CURRENT_BATTLE')();
export const setBattlePlayers = createAction('@battle/SET_BATTLE_PLAYERS')();
export const removePlayerFromBattle = createAction('@battle/REMOVE_PLAYER_FROM_BATTLE')();
export const resetCurrentBattle = createAction('@battle/RESET_CURRENT_BATTLE')();
