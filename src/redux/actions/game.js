import { createAction } from 'typesafe-actions';

export const setCurrentGame = createAction('@game/SET_CURRENT_GAME')();
export const setTotalRoundScore = createAction('@game/SET_TOTAL_ROUND_SCORE')();
export const setTotalRoundCounter = createAction('@game/SET_TOTAL_ROUND_COUNTER')();
