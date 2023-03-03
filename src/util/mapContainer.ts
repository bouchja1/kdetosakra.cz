import {
    MAX_DISTANCE_TO_GAIN_100_PERCENT_KM,
    MAX_SCORE_PERCENT,
    MIN_DISTANCE_FOR_POINTS_RANDOM,
    guessResultMode,
} from '../constants/game';
import { MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import gameModes from '../enums/modes';

interface MarkLatLon {
    lat: number;
    lon: number;
}

const getDistance = (panoramaCoordinates: MarkLatLon) => {
    if (
        panoramaCoordinates.lat === currentMapPointCoordinates.mapLat &&
        panoramaCoordinates.lon === currentMapPointCoordinates.mapLon
    ) {
        return 0;
    }

    const radlat1 = (Math.PI * panoramaCoordinates.lat) / 180;
    const radlat2 = (Math.PI * currentMapPointCoordinates.mapLat) / 180;
    const theta = panoramaCoordinates.lon - currentMapPointCoordinates.mapLon;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist *= 1.609344; // convert from miles to kilometers
    return dist;
};

const calculateScore = (
    distance: number,
    gameMode: string,
    saveRoundResult: (score: number, distance: number) => void,
    radius: number = 1,
) => {
    let minDistanceForPoints;
    if (gameMode === gameModes.random || gameMode === gameModes.randomRegion) {
        minDistanceForPoints = MIN_DISTANCE_FOR_POINTS_RANDOM;
    } else if (gameMode === gameModes.amazingPlaces) {
        minDistanceForPoints = radius + 2;
    } else {
        minDistanceForPoints = radius + 2;
    }
    let score;
    // distance less than 30 meters
    if (distance < MAX_DISTANCE_TO_GAIN_100_PERCENT_KM) {
        score = 100;
    } else {
        score = (minDistanceForPoints - distance) / (minDistanceForPoints / MAX_SCORE_PERCENT);
        if (score < 0) {
            score = 0;
        } else {
            score = score ** 2 / MAX_SCORE_PERCENT + distance / minDistanceForPoints;
            score = Math.max(0, score);
            score = Math.min(MAX_SCORE_PERCENT, score);
        }
    }

    saveRoundResult(score, distance);
    return score;
};

export const calculateDistanceForPanorama = (
    isBattle: boolean,
    gameMode: string,
    saveRoundResult: (score: number, distance: number) => void,
    panoramaSceneCoordinates: MarkLatLon,
    panoramaPlaceCoordinates: MarkLatLon,
    currentGame: any,
    currentBattleInfo: any,
) => {
    const { lat, lon } = panoramaPlaceCoordinates;

    if (isBattle) {
        const { guessResultMode: guessResultModeBattle } = currentBattleInfo;
        if (guessResultModeBattle === guessResultMode.start) {
            panoramaSceneCoordinates = {
                lat,
                lon,
            };
        }
    } else {
        const { guessResultMode: guessResultModeSinglePlayer } = currentGame;
        if (guessResultModeSinglePlayer === guessResultMode.start) {
            panoramaSceneCoordinates = {
                lat,
                lon,
            };
        }
    }

    const distance = getDistance(panoramaSceneCoordinates);
    const score = calculateScore(distance, gameMode, saveRoundResult);
    return {
        panoramaCoordinates: panoramaSceneCoordinates,
        distance,
        score,
    };
};

export const calculateDistanceForPlace = (
    gameMode: string,
    saveRoundResult: (score: number, distance: number) => void,
    placeCoordinates: MarkLatLon,
) => {
    const distance = getDistance(placeCoordinates);
    const score = calculateScore(distance, gameMode, saveRoundResult);
    return {
        distance,
        score,
    };
};

export const drawDistanceToTheMap = (
    SMap: any,
    currentPanoramaPositionPoint: any,
    selectedPointOnMap: any,
    panoramaCoordinates: any,
) => {
    const markerPanoramaOptions = {
        url: MARKER_PLACE_ICON_KDETOSAKRA,
        anchor: { left: 10, bottom: 15 },
    };

    const guessedVectorPathCoordinates = [currentPanoramaPositionPoint, selectedPointOnMap];
    const vectorPathOptions = {
        color: '#f00',
        width: 3,
    };
    const path = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, guessedVectorPathCoordinates, vectorPathOptions);
    // panorama place marker
    const markerPanorama = new SMap.Marker(
        SMap.Coords.fromWGS84(panoramaCoordinates.lon, panoramaCoordinates.lat),
        'Panorama point',
        markerPanoramaOptions,
    );
};
