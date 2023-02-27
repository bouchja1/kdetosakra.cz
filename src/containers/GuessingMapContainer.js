import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import maximizeMapShadow from '../assets/images/map/maximizeMapShadow.png';
import minimizeMapShadow from '../assets/images/map/minimizeMapShadowFull.png';
import minimizeMapShadowDisabled from '../assets/images/map/minimizeMapShadowFullDisabled.png';
import GuessingMap from '../components/GuessingMap';
import GuessingMapButton from '../components/GuessingMapButton';
import GuessLimitModal from '../components/GuessLimitModal';
import { MAX_SCORE_PERCENT, MIN_DISTANCE_FOR_POINTS_RANDOM, guessResultMode } from '../constants/game';
import { MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import MapyCzContext from '../context/MapyCzContext';
import gameModes from '../enums/modes';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import useSMapResize from '../hooks/useSMapResize';
import { incrementMyTotalScore } from '../redux/actions/battle';
import { addGuessedRoundToPlayer, updateBattleRound } from '../services/firebase';
import { findUserFromBattleByRandomTokenId, getUnixTimestamp } from '../util';

export const GuessingMapContainer = ({
    isBattle,
    visible,
    evaluateGuessedRound,
    currentRoundGuessedPoint,
    panoramaLoading,
    findNewPanorama,
    saveRoundResult,
    panoramaScene,
    panoramaPlace,
    allGuessedPoints,
    isGameStarted,
    currentCity,
    nextRoundButtonVisible,
    changeNextRoundButtonVisibility,
}) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const [smapDimensionLocalStorage] = useLocalStorage('smapDimension');
    const randomUserToken = useGetRandomUserToken();
    const { width, height } = useSMapResize();
    const [showGuessLimitModal, setShowGuessLimitModal] = useState(false);
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [currentRoundBattle, setCurrentRoundBattle] = useState();
    const [mapStyle, setMapStyle] = useState();
    const [mapDimension, setMapDimension] = useState(smapDimensionLocalStorage || 'normal');
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

    useEffect(() => {
        if (width > 960) {
            if (!visible) {
                setMapStyle({ display: 'none' });
            }
            if (mapDimension === 'max') {
                setMapStyle({ height: height / 1.2, width: width / 1.5 });
            } else {
                setMapStyle({ height: height / 2, width: width / 3 });
            }
        } else {
            setMapStyle(null);
        }
    }, [width, height]);

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

        if (isBattle && isGameStarted) {
            const { mode: battleMode, radius: battleRadius, myTotalScore } = currentBattleInfo;
            setCommonVars(battleMode, battleRadius, myTotalScore, battleRound);
        } else {
            const {
                mode: currentGameMode,
                radius: currentGameRadius,
                totalScore: currentGameTotalScore,
                round: currentGameRound,
            } = currentGame;
            setCommonVars(currentGameMode, currentGameRadius, currentGameTotalScore, currentGameRound);
        }
    }, [isBattle, isGameStarted, currentGame, currentBattleInfo, battleRound]);

    const guessingMapButtonVisible = useMemo(() => {
        if (isBattle) {
            if (!currentRoundBattle) {
                return false;
            }

            const { isRoundActive } = currentRoundBattle;
            if (!isRoundActive) {
                return false;
            }

            const myUser = findUserFromBattleByRandomTokenId(players, randomUserToken);
            return !myUser[`round${battleRound}`];
        }
        return true;
    }, [currentRoundBattle, battleRound, isBattle, players, randomUserToken]);

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

        if (isBattle) {
            const { guessResultMode: guessResultModeBattle } = currentBattleInfo;
            if (guessResultModeBattle === guessResultMode.start) {
                panoramaCoordinates = {
                    lat: panoramaPlace.latitude,
                    lon: panoramaPlace.longitude,
                };
            }
        } else {
            const { guessResultMode: guessResultModeSinglePlayer } = currentGame;
            if (guessResultModeSinglePlayer === guessResultMode.start) {
                panoramaCoordinates = {
                    lat: panoramaPlace.latitude,
                    lon: panoramaPlace.longitude,
                };
            }
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

    const saveCurrentClickedMapPointCoordinates = coordinates => {
        setCurrentMapPointCoordinates(coordinates);
        setGuessButtonDisabled(false);
    };

    const calculateScore = distance => {
        let minDistanceForPoints;
        if (mode === gameModes.random || mode === gameModes.randomRegion) {
            minDistanceForPoints = MIN_DISTANCE_FOR_POINTS_RANDOM;
        } else {
            minDistanceForPoints = radius + 2;
        }
        let score;
        // distance less than 20 meters
        if (distance < 0.2) {
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

        const { panoramaCoordinates, distance, score } = calculateDistance();

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
        findNewPanorama();
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        changeNextRoundButtonVisibility(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    const getSMapCollapseMin = () => {
        if (width > 960) {
            return { height: 100, width: 100 };
        }
        return null;
    };

    return (
        <>
            {visible && mapDimension !== 'min' && (
                <div id="smap-container" className="smap-container" style={mapStyle}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <img
                        alt="Maximální velikost mapy"
                        className={`smap-collapsible-max-max ${mapDimension === 'max' ? 'max-max-disabled' : ''}`}
                        src={mapDimension === 'max' ? minimizeMapShadowDisabled : minimizeMapShadow}
                        onClick={() => {
                            setMapStyle({ height: height / 1.2, width: width / 1.5 });
                            setMapDimension('max');
                            writeStorage('smapDimension', 'max');
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <img
                        alt="Normální velikost mapy"
                        className="smap-collapsible-max"
                        src={minimizeMapShadow}
                        onClick={() => {
                            if (mapDimension === 'max') {
                                setMapStyle({ height: height / 2, width: width / 3 });
                                setMapDimension('normal');
                                writeStorage('smapDimension', 'normal');
                            } else if (mapDimension === 'normal') {
                                setMapDimension('min');
                                writeStorage('smapDimension', 'min');
                            }
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                    <GuessingMap
                        currentRoundGuessedPoint={currentRoundGuessedPoint}
                        isBattle={isBattle}
                        refLayerValue={refLayerValue}
                        roundGuessed={roundGuessed}
                        refVectorLayerSMapValue={refVectorLayerSMapValue}
                        saveCurrentClickedMapPointCoordinates={saveCurrentClickedMapPointCoordinates}
                    />
                    {guessingMapButtonVisible && (
                        <GuessingMapButton
                            refreshMap={refreshMap}
                            isBattle={isBattle}
                            guessBattleRound={guessBattleRound}
                            guessSingleplayerRound={guessSingleplayerRound}
                            allGuessedPoints={allGuessedPoints}
                            round={round}
                            totalScore={totalScore}
                            roundGuessed={roundGuessed}
                            disabled={guessButtonDisabled || panoramaLoading || !isGameStarted}
                            currentRound={isBattle ? currentRoundBattle : currentGame.round}
                            currentGame={currentGame}
                            nextRoundButtonVisible={nextRoundButtonVisible}
                        />
                    )}
                </div>
            )}
            {mapDimension === 'min' && (
                <div className="smap-container" style={getSMapCollapseMin()}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <img
                        alt="Zmenšená mapa"
                        className="smap-collapsible-min"
                        src={maximizeMapShadow}
                        onClick={() => {
                            setMapDimension('normal');
                            writeStorage('smapDimension', 'normal');
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                </div>
            )}
            <GuessLimitModal
                visible={showGuessLimitModal}
                handleGuessModalVisibility={() => setShowGuessLimitModal(false)}
            />
        </>
    );
};
