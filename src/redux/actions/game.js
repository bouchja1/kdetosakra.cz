import { createAction } from 'typesafe-actions';

export const setCurrentGame = createAction('@game/SET_CURRENT_GAME')();
export const setTotalRoundScore = createAction('@game/SET_TOTAL_ROUND_SCORE')();
export const addPanoramaPlaceToCurrentGameRounds = createAction('@game/ADD_PANORAMA_PLACE')();
export const setTotalRoundCounter = createAction('@game/SET_TOTAL_ROUND_COUNTER')();
export const setCurrentMapLayer = createAction('@game/SET_CURRENT_MAP_LAYER')();
