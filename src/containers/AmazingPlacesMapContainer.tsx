import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GuessingMapButton from '../components/GuessingMapButton';
import { LittleMapImage } from '../components/littleMap/LittleMapImage';
import { guessResultMode } from '../constants/game';
import { MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import MapyCzContext from '../context/MapyCzContext';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import { incrementMyTotalScore } from '../redux/actions/battle';
import { addGuessedRoundToPlayer, updateBattleRound } from '../services/firebase';
import { getUnixTimestamp } from '../util';
import { calculateDistanceForPlace } from '../util/mapContainer';

interface AmazingPlacesMapContainerProps {
    mapDimension: 'min' | 'max' | 'normal';
    onSetMapDimension: (dimension: 'min' | 'max' | 'normal') => void;
    onGuessNextRound: () => void;
    saveRoundResult: (score: number, distance: number) => void;
}

export const AmazingPlacesMapContainer = ({
    mapDimension,
    onSetMapDimension,
    onGuessNextRound,

    evaluateGuessedRound,
    currentRoundGuessedPoint,
    saveRoundResult,
    allGuessedPoints,
    currentCity,
    nextRoundButtonVisible,
    changeNextRoundButtonVisibility,
}: AmazingPlacesMapContainerProps) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const randomUserToken = useGetRandomUserToken();
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [currentRoundBattle, setCurrentRoundBattle] = useState();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [roundGuessed, setRoundGuessed] = useState(false);
    const [currentMapPointCoordinates, setCurrentMapPointCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    // common vars for both multiplayer and singleplayer
    const [mode, setMode] = useState();
    const [radius, setRadius] = useState();
    const [totalScore, setTotalScore] = useState();
    const [round, setRound] = useState();

    const refLayerValue = useRef();
    const refVectorLayerSMapValue = useRef();

    const { battleId, myDocumentId, myNickname, round: battleRound, rounds, players } = currentBattleInfo;

    /*
    When the round is changed
     */
    useEffect(() => {
        if (round && rounds.length) {
            setCurrentRoundBattle(rounds[round - 1]);
            if (currentRoundGuessedPoint) {
                setRoundGuessed(true);
            } else {
                // when a new round is switched to
                if (refLayerValue.current) {
                    refLayerValue.current.removeAll();
                }
                if (refVectorLayerSMapValue.current) {
                    refVectorLayerSMapValue.current.removeAll();
                }
                setGuessButtonDisabled(true);
                changeNextRoundButtonVisibility(false);
                setRoundGuessed(false);
                window.scrollTo(0, 0);
            }
        }
    }, [round, rounds, currentRoundGuessedPoint]);

    useEffect(() => {
        const setCommonVars = (modeVar, radiusVar, totalScoreVar, roundVar) => {
            setMode(modeVar);
            setRadius(radiusVar);
            setTotalScore(totalScoreVar);
            setRound(roundVar);
        };

        const {
            mode: currentGameMode,
            radius: currentGameRadius,
            totalScore: currentGameTotalScore,
            round: currentGameRound,
        } = currentGame;
        setCommonVars(currentGameMode, currentGameRadius, currentGameTotalScore, currentGameRound);
    }, [currentGame, currentBattleInfo, battleRound]);

    const guessSingleplayerRound = () => {
        const guessedRoundPoint = calculateCoordsAndDrawGuess();
        evaluateGuessedRound(guessedRoundPoint);
    };

    const guessBattleRound = async () => {
        const guessedRoundPoint = calculateCoordsAndDrawGuess();
        const { isGuessed } = currentRoundBattle;

        // FIXME: check if I am not making a guess after time expiration

        evaluateGuessedRound(guessedRoundPoint);
        const { pointMap, pointPanorama, distance, score } = guessedRoundPoint;
        const playerRoundGuess = {
            [`round${battleRound}`]: {
                roundId: battleRound,
                pointPanorama: {
                    x: pointPanorama.x,
                    y: pointPanorama.y,
                },
                pointMap: {
                    x: pointMap.x,
                    y: pointMap.y,
                },
                distance,
                score,
            },
        };

        dispatch(incrementMyTotalScore(Math.round(score)));

        if (!isGuessed) {
            return addGuessedRoundToPlayer(battleId, myDocumentId, playerRoundGuess)
                .then(res => {
                    return updateBattleRound(battleId, battleRound, {
                        isGuessed: true,
                        guessedTime: getUnixTimestamp(new Date()),
                        firstGuess: {
                            guessedById: randomUserToken,
                            name: myNickname,
                        },
                    });
                })
                .then(res => {
                    console.info('Battle round updated.');
                })
                .catch(err => {
                    console.error('addGuessedRoundToPlayer and updateBattleRound: ', err);
                });
        }

        // spocti rozdil mezi guessedtime a timeoutem
        return addGuessedRoundToPlayer(battleId, myDocumentId, playerRoundGuess)
            .then(res => {})
            .catch(err => {
                console.error('addGuessedRoundToPlayer: ', err);
            });
    };

    const calculateDistance = () => {
        // eslint-disable-next-line no-underscore-dangle
        let panoramaCoordinates = panoramaScene._place._data.mark;
        const { lat, lon } = bestPanoramaPlace._data.mark;

        const { guessResultMode: guessResultModeSinglePlayer } = currentGame;
        if (guessResultModeSinglePlayer === guessResultMode.start) {
            panoramaCoordinates = {
                lat,
                lon,
            };
        }

        let distance;
        if (
            panoramaCoordinates.lat === currentMapPointCoordinates.mapLat &&
            panoramaCoordinates.lon === currentMapPointCoordinates.mapLon
        ) {
            distance = 0;
        } else {
            const radlat1 = (Math.PI * panoramaCoordinates.lat) / 180;
            const radlat2 = (Math.PI * currentMapPointCoordinates.mapLat) / 180;
            const theta = panoramaCoordinates.lon - currentMapPointCoordinates.mapLon;
            const radtheta = (Math.PI * theta) / 180;
            let dist =
                Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515;
            dist *= 1.609344; // convert from miles to kilometers
            distance = dist;
        }
        const score = calculateScore(distance);
        return {
            panoramaCoordinates,
            distance,
            score,
        };
    };

    const handleSaveCurrentClickedMapPointCoordinates = (coordinates: any) => {
        setCurrentMapPointCoordinates(coordinates);
        setGuessButtonDisabled(false);
    };

    const drawGuessedDistance = (currentPanoramaPositionPoint, selectedPointOnMap, panoramaCoordinates) => {
        const markerPanoramaOptions = {
            url: MARKER_PLACE_ICON_KDETOSAKRA,
            anchor: { left: 10, bottom: 15 },
        };

        const guessedVectorPathCoordinates = [currentPanoramaPositionPoint, selectedPointOnMap];
        const vectorPathOptions = {
            color: '#f00',
            width: 3,
        };
        const path = new mapyContext.SMap.Geometry(
            mapyContext.SMap.GEOMETRY_POLYLINE,
            null,
            guessedVectorPathCoordinates,
            vectorPathOptions,
        );
        refVectorLayerSMapValue.current.addGeometry(path);
        // panorama place marker
        const markerPanorama = new mapyContext.SMap.Marker(
            mapyContext.SMap.Coords.fromWGS84(panoramaCoordinates.lon, panoramaCoordinates.lat),
            'Panorama point',
            markerPanoramaOptions,
        );
        refLayerValue.current.addMarker(markerPanorama);
    };

    const calculateCoordsAndDrawGuess = () => {
        setGuessButtonDisabled(true);
        changeNextRoundButtonVisibility(true);
        setRoundGuessed(true);

        const { panoramaCoordinates, distance, score } = calculateDistanceForPlace(mode, saveRoundResult, currentGame);

        const guessedPanoramaPositionPoint = mapyContext.SMap.Coords.fromWGS84(
            panoramaCoordinates.lon,
            panoramaCoordinates.lat,
        );
        const selectedPointOnMap = mapyContext.SMap.Coords.fromWGS84(
            currentMapPointCoordinates.mapLon,
            currentMapPointCoordinates.mapLat,
        );
        drawGuessedDistance(guessedPanoramaPositionPoint, selectedPointOnMap, panoramaCoordinates);
        const guessedRoundPoint = {
            pointPanorama: guessedPanoramaPositionPoint,
            pointMap: selectedPointOnMap,
            currentCity,
            distance,
            score,
        };
        return guessedRoundPoint;
    };

    /**
     * Refresh map for a new guessing!
     */
    const refreshMap = () => {
        onGuessNextRound();
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        changeNextRoundButtonVisibility(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    return (
        <LittleMapImage
            onSaveCurrentClickedMapPointCoordinates={handleSaveCurrentClickedMapPointCoordinates}
            onSetMapDimension={onSetMapDimension}
            mapDimension={mapDimension}
            visible={true}
            GuessingMapButton={
                <GuessingMapButton
                    refreshMap={refreshMap}
                    guessBattleRound={guessBattleRound}
                    guessSingleplayerRound={guessSingleplayerRound}
                    allGuessedPoints={allGuessedPoints}
                    round={round}
                    totalScore={totalScore}
                    roundGuessed={roundGuessed}
                    disabled={guessButtonDisabled}
                    currentRound={currentGame.round}
                    currentGame={currentGame}
                    nextRoundButtonVisible={nextRoundButtonVisible}
                />
            }
        />
    );
};
