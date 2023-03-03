import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GuessingMap from '../components/GuessingMap';
import GuessingMapButton from '../components/GuessingMapButton';
import GuessLimitModal from '../components/GuessLimitModal';
import { LittleMapImage } from '../components/littleMap/LittleMapImage';
import MapyCzContext from '../context/MapyCzContext';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import { incrementMyTotalScore } from '../redux/actions/battle';
import { addGuessedRoundToPlayer, updateBattleRound } from '../services/firebase';
import { findUserFromBattleByRandomTokenId, getUnixTimestamp } from '../util';
import { calculateDistanceForPanorama, drawDistanceToTheMap } from '../util/mapContainer';

export const GuessingMapContainer = ({
    isBattle = false,
    visible = true,
    evaluateGuessedRound,
    currentRoundGuessedPoint,
    panoramaLoading,
    findNewPanorama,
    saveRoundResult,
    panoramaScene,
    bestPanoramaPlace,
    allGuessedPoints,
    isGameStarted,
    currentCity,
    nextRoundButtonVisible,
    changeNextRoundButtonVisibility,
    mapDimension,
    onSetMapDimension,
}) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const randomUserToken = useGetRandomUserToken();
    const [showGuessLimitModal, setShowGuessLimitModal] = useState(false);
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
    When the battle round is changed
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

    const handleSaveCurrentClickedMapPointCoordinates = coordinates => {
        setCurrentMapPointCoordinates(coordinates);
        setGuessButtonDisabled(false);
    };

    const drawGuessedDistance = (currentPanoramaPositionPoint, selectedPointOnMap, panoramaCoordinates) => {
        const { path, markerPanorama } = drawDistanceToTheMap(
            mapyContext.SMap,
            currentPanoramaPositionPoint,
            selectedPointOnMap,
            panoramaCoordinates,
        );
        refVectorLayerSMapValue.current.addGeometry(path);
        refLayerValue.current.addMarker(markerPanorama);
    };

    const calculateCoordsAndDrawGuess = () => {
        setGuessButtonDisabled(true);
        changeNextRoundButtonVisibility(true);
        setRoundGuessed(true);

        // eslint-disable-next-line no-underscore-dangle
        const panoramaSceneCoordinates = panoramaScene._place._data.mark;
        const panoramaPlaceCoords = bestPanoramaPlace._data.mark;

        const { panoramaCoordinates, distance, score } = calculateDistanceForPanorama(
            isBattle,
            mode,
            saveRoundResult,
            currentMapPointCoordinates,
            { lat: panoramaSceneCoordinates.lat, lon: panoramaSceneCoordinates.lon },
            { lat: panoramaPlaceCoords.lat, lon: panoramaPlaceCoords.lon },
            radius,
            currentGame,
            currentBattleInfo,
        );

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

    return (
        <>
            <LittleMapImage
                onSaveCurrentClickedMapPointCoordinates={handleSaveCurrentClickedMapPointCoordinates}
                onSetMapDimension={onSetMapDimension}
                mapDimension={mapDimension}
                visible={visible}
                GuessingMap={
                    <>
                        <GuessingMap
                            currentRoundGuessedPoint={currentRoundGuessedPoint}
                            refLayerValue={refLayerValue}
                            roundGuessed={roundGuessed}
                            refVectorLayerSMapValue={refVectorLayerSMapValue}
                            saveCurrentClickedMapPointCoordinates={handleSaveCurrentClickedMapPointCoordinates}
                            isBattle={isBattle}
                        />
                        <>
                            {guessingMapButtonVisible ? (
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
                            ) : null}
                        </>
                    </>
                }
            />
            <GuessLimitModal
                visible={showGuessLimitModal}
                handleGuessModalVisibility={() => setShowGuessLimitModal(false)}
            />
        </>
    );
};
