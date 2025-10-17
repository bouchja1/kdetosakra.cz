import battleReducer from './battle';
import gameReducer from './game';
import panoramaReducer from './pano';
import resultReducer from './result';

export const reducers = {
    game: gameReducer,
    result: resultReducer,
    battle: battleReducer,
    pano: panoramaReducer,
};
