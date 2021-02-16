import { getType } from 'typesafe-actions';

import { resetLastPanoramaPlace, setLastPanoramaPlace } from '../actions/pano';

const initialState = {
    lat: null,
    lon: null,
};

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(setLastPanoramaPlace): {
            const { lat, lon } = action.payload;
            return {
                ...state,
                lat,
                lon,
            };
        }
        case getType(resetLastPanoramaPlace): {
            return initialState;
        }
        default:
            return state;
    }
};

export default gameReducer;
