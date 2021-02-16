import gameReducer from './game';
import resultReducer from './result';
import panoramaReducer from './pano';
import battleReducer from './battle';

export const reducers = {
    game: gameReducer,
    result: resultReducer,
    battle: battleReducer,
    pano: panoramaReducer,
};
