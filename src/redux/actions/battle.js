import { createAction } from 'typesafe-actions';

export const setCurrentBattle = createAction('@battle/SET_CURRENT_BATTLE')();
export const setBattlePlayers = createAction('@battle/SET_BATTLE_PLAYERS')();
export const addPlayerToBattle = createAction('@battle/ADD_PLAYER_TO_BATTLE')();
export const removePlayerFromBattle = createAction('@battle/REMOVE_PLAYER_FROM_BATTLE')();
