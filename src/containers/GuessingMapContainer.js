import React, {
    useContext, useEffect, useRef, useState, useMemo
} from 'react';
import { writeStorage } from '@rehooks/local-storage';
import { useDispatch, useSelector } from 'react-redux';
import minimizeMapShadow from '../assets/images/map/minimizeMapShadow.png';
import maximizeMapShadow from '../assets/images/map/maximizeMapShadow.png';
import useSMapResize from '../hooks/useSMapResize';
import GuessingMapButton from '../components/GuessingMapButton';
import GuessLimitModal from '../components/GuessLimitModal';
import { incrementMyTotalScore } from '../redux/actions/battle';
import GuessingMap from '../components/GuessingMap';
import { addGuessedRoundToPlayer, updateBattleRound } from '../services/firebase';
import { findUserFromBattleByRandomTokenId, getUnixTimestamp } from '../util';
import gameModes from '../enums/modes';
import { MAX_SCORE_PERCENT, MIN_DISTANCE_FOR_POINTS_RANDOM } from '../constants/game';
import { MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import MapyCzContext from '../context/MapyCzContext';

export const GuessingMapContainer = ({
    maximized,
    isBattle,
    visible,
    evaluateGuessedRound,
    currentRoundGuessedPoint,
    panoramaLoading,
    findNewPanorama,
    saveRoundResult,
    panoramaScene,
    allGuessedPoints,
    isGameStarted,
    currentCity,
}) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const randomUserToken = useGetRandomUserToken();
    const { width, height } = useSMapResize();
    const [showGuessLimitModal, setShowGuessLimitModal] = useState(false);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
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

    const {
        battleId,
        myDocumentId,
        mode: battleMode,
        radius: battleRadius,
        myNickname,
        myTotalScore,
        round: battleRound,
        rounds,
        players,
    } = currentBattleInfo;

    useEffect(() => {
        const setCommonVars = (modeVar, radiusVar, totalScoreVar, roundVar) => {
            setMode(modeVar);
            setRadius(radiusVar);
            setTotalScore(totalScoreVar);
            setRound(roundVar);
        };

        if (isBattle && isGameStarted) {
            setCommonVars(battleMode, battleRadius, myTotalScore, battleRound);
            setCurrentRoundBattle(rounds[round - 1]);
        } else {
            const {
                mode: currentGameMode,
                radius: currentGameRadius,
                city,
                totalScore: currentGameTotalScore,
                round: currentGameRound,
            } = currentGame;
            setCommonVars(currentGameMode, currentGameRadius, currentGameTotalScore, currentGameRound);
        }
    }, [isBattle, isGameStarted, currentGame, currentBattleInfo]);

    const guessingMapButtonVisible = useMemo(() => {
        console.log('CUUURENT ROUND BATTLE: ', currentRoundBattle);
        if (isBattle && currentRoundBattle) {
            const { isRoundActive } = currentRoundBattle;
            if (!isRoundActive) {
                return false;
            }

            const myUser = findUserFromBattleByRandomTokenId(players, randomUserToken);
            return !myUser[`round${battleRound}`];
        }
        return true;
    }, [currentRoundBattle]);

    const guessBattleRound = () => {
        const guessedRoundPoint = calculateCoordsAndDrawGuess();
        const { isGuessed, isRoundActive } = currentRoundBattle;

        // TODO omezit nejak, aby se nemohlo hadat po skonceni casovyho limitu?

        evaluateGuessedRound(guessedRoundPoint);
        const {
            pointMap, pointPanorama, distance, score,
        } = guessedRoundPoint;
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
            addGuessedRoundToPlayer(battleId, myDocumentId, playerRoundGuess)
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
                .then(res => {})
                .catch(err => console.log('EEEEERRR: ', err));
        } else {
            // spocti rozdil mezi guessedtime a timeoutem
            addGuessedRoundToPlayer(battleId, myDocumentId, playerRoundGuess)
                .then(res => {})
                .catch(err => {});
        }
    };

    const guessSingleplayerRound = () => {
        const guessedRoundPoint = calculateCoordsAndDrawGuess();
        evaluateGuessedRound(guessedRoundPoint);
    };

    const calculateDistance = () => {
        // eslint-disable-next-line no-underscore-dangle
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if (
            panoramaCoordinates.lat === currentMapPointCoordinates.mapLat
            && panoramaCoordinates.lon === currentMapPointCoordinates.mapLon
        ) {
            distance = 0;
        } else {
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
            dist *= 1.609344; // convert to kilometers
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
        if (mode === gameModes.random) {
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
        setNextRoundButtonVisible(true);
        setRoundGuessed(true);

        const { panoramaCoordinates, distance, score } = calculateDistance();

        const currentPanoramaPositionPoint = mapyContext.SMap.Coords.fromWGS84(
            panoramaCoordinates.lon,
            panoramaCoordinates.lat,
        );
        const selectedPointOnMap = mapyContext.SMap.Coords.fromWGS84(
            currentMapPointCoordinates.mapLon,
            currentMapPointCoordinates.mapLat,
        );
        drawGuessedDistance(currentPanoramaPositionPoint, selectedPointOnMap, panoramaCoordinates);
        const guessedRoundPoint = {
            pointPanorama: currentPanoramaPositionPoint,
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
        /*
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
         */
        setNextRoundButtonVisible(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    const getSMapCollapseMax = () => {
        if (width > 960) {
            if (!visible) {
                return { display: 'none' };
            }
            return { height: height / 2, width: width / 3 };
        }
        return null;
    };

    const getSMapCollapseMin = () => {
        if (width > 960) {
            return { height: 100, width: 100 };
        }
        return null;
    };

    return (
        <>
            <div id="smap-container" className="smap-container" style={getSMapCollapseMax()}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                <img
                    className="smap-collapsible-max"
                    src={minimizeMapShadow}
                    onClick={() => writeStorage('smapVisible', false)}
                />
                <GuessingMap
                    currentRoundGuessedPoint={currentRoundGuessedPoint}
                    isBattle={isBattle}
                    refLayerValue={refLayerValue}
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
            {!maximized && (
                <div className="smap-container" style={getSMapCollapseMin()}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                    <img
                        className="smap-collapsible-min"
                        src={maximizeMapShadow}
                        onClick={() => {
                            writeStorage('smapVisible', true);
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
