import React, {
    useState, useContext, useRef, useEffect
} from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import MapyCzContext from '../../context/MapyCzContext';
import { MAX_SCORE_PERCENT, MIN_DISTANCE_FOR_POINTS_RANDOM, TOTAL_ROUNDS_MAX } from '../../constants/game';
import { MARKER_PLACE_ICON_KDETOSAKRA, DEFAUL_MARKER_ICON } from '../../constants/icons';
import { setLastResult } from '../../redux/actions/result';
import { RoundSMapWrapper } from '../SMap/RoundSMapWrapper';
import { ResultSMapWrapper } from '../SMap/ResultSMapWrapper';
import gameModes from '../../enums/modes';
import { setTotalRoundCounter } from '../../redux/actions/game';
import { incrementMyTotalScore } from '../../redux/actions/battle';
import { addGuessedRoundToPlayer, updateBattleRound } from '../../services/firebase';
import { getUnixTimestamp } from '../../util';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const GuessingMap = ({
    makeCountScore,
    makeRefreshPanorama,
    currentRound,
    guessedPoints,
    makeRoundResult,
    panoramaScene,
    makeGuessedPlace,
    panoramaLoading,
    isGameStarted,
    currentCity,
    isBattle,
}) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    // common vars for both multiplayer and singleplayer
    const [mode, setMode] = useState();
    const [radius, setRadius] = useState();
    const [totalScore, setTotalScore] = useState();
    const [round, setRound] = useState();
    // common vars for both multiplayer and singleplayer

    const [roundGuessed, setRoundGuessed] = useState(false);
    const randomUserToken = useGetRandomUserToken();

    const refLayerValue = useRef();
    const refVectorLayerSMapValue = useRef();
    const refLayeredMapValue = useRef();

    const [showResult, setShowResult] = useState(false);
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    const [guessedCoordinates, setGuessedCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    useEffect(() => {
        const setCommonVars = (modeVar, radiusVar, totalScoreVar, roundVar) => {
            setMode(modeVar);
            setRadius(radiusVar);
            setTotalScore(totalScoreVar);
            setRound(roundVar);
        };

        if (isBattle && isGameStarted) {
            const {
                mode: battleMode, radius: battleRadius, myTotalScore, round: battleRound,
            } = currentBattleInfo;
            setCommonVars(battleMode, battleRadius, myTotalScore, battleRound);
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

    /**
     * Refresh map for a new guessing!
     */
    const refreshMap = () => {
        makeRefreshPanorama();
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        setNextRoundButtonVisible(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    const decideGuessButtonVisibility = () => {
        return guessButtonDisabled || panoramaLoading || !isGameStarted;
    };

    const clickMapPoint = (e, elm) => {
        // Došlo ke kliknutí, spočítáme kde
        const options = {
            url: DEFAUL_MARKER_ICON,
            anchor: { left: 10, bottom: 1 } /* Ukotvení značky za bod uprostřed dole */,
        };
        // state is not working in event handling
        // if (guessButtonDisabled && refLayerValue.current && !nextRoundButtonVisible) {
        refLayerValue.current.removeAll();
        const coords = mapyContext.SMap.Coords.fromEvent(e.data.event, refLayeredMapValue.current);
        // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
        const marker = new mapyContext.SMap.Marker(
            mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y),
            'Můj odhad',
            options,
        );
        refLayerValue.current.addMarker(marker);
        setGuessedCoordinates({
            mapLat: coords.y,
            mapLon: coords.x,
        });
        setGuessButtonDisabled(false);
        // }
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
        makeRoundResult(score, distance);
        return score;
    };

    const calculateDistance = () => {
        // eslint-disable-next-line no-underscore-dangle
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if (
            panoramaCoordinates.lat === guessedCoordinates.mapLat
            && panoramaCoordinates.lon === guessedCoordinates.mapLon
        ) {
            distance = 0;
        } else {
            const radlat1 = (Math.PI * panoramaCoordinates.lat) / 180;
            const radlat2 = (Math.PI * guessedCoordinates.mapLat) / 180;
            const theta = panoramaCoordinates.lon - guessedCoordinates.mapLon;
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
        if (mode === gameModes.random) {
            makeGuessedPlace();
        }
        const score = calculateScore(distance);
        return {
            panoramaCoordinates,
            distance,
            score,
        };
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
            guessedCoordinates.mapLon,
            guessedCoordinates.mapLat,
        );
        drawGuessedDistance(currentPanoramaPositionPoint, selectedPointOnMap, panoramaCoordinates);
        const guessedRoundPoint = {
            pointPanorama: currentPanoramaPositionPoint,
            pointMap: selectedPointOnMap,
            currentCity,
            distance,
            score,
        };
        makeCountScore(guessedRoundPoint);
        return guessedRoundPoint;
    };

    if (showResult) {
        return (
            <Redirect
                to={{
                    pathname: '/vysledek',
                }}
            >
                Vyhodnotit hru
            </Redirect>
        );
    }

    return (
        <>
            {!roundGuessed ? (
                <RoundSMapWrapper
                    onMapClick={clickMapPoint}
                    refLayeredMapValue={refLayeredMapValue}
                    refLayerValue={refLayerValue}
                    refVectorLayerSMapValue={refVectorLayerSMapValue}
                    isBattle={isBattle}
                />
            ) : (
                <ResultSMapWrapper guessedPoints={[guessedPoints[guessedPoints.length - 1]]} isBattle={isBattle} />
            )}
            {currentRound >= TOTAL_ROUNDS_MAX && roundGuessed ? (
                <Button
                    type="primary"
                    onClick={() => {
                        // storeResult(mode, city?.name, totalRoundScore, randomUserResultToken) // not used now
                        dispatch(setLastResult({ guessedPoints, totalScore }));
                        setShowResult(true);
                    }}
                >
                    Vyhodnotit hru
                </Button>
            ) : (
                <>
                    {!nextRoundButtonVisible ? (
                        <Button
                            disabled={decideGuessButtonVisibility()}
                            onClick={() => {
                                // TODO mozna neumoznit hadat pokud uz bude po limitu

                                const guessedRoundPoint = calculateCoordsAndDrawGuess();
                                if (isBattle) {
                                    const {
                                        battleId,
                                        myDocumentId,
                                        myNickname,
                                        round: currentGuessedRoundNumber,
                                        rounds,
                                        withCountdown,
                                        countdown,
                                    } = currentBattleInfo;
                                    const guessedCurrentRound = rounds[currentGuessedRoundNumber - 1];
                                    const { isGuessed, guessedTime } = guessedCurrentRound;

                                    const { pointMap, distance, score } = guessedRoundPoint;
                                    const playerRoundGuess = {
                                        [`round${currentGuessedRoundNumber}`]: {
                                            roundId: currentGuessedRoundNumber,
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
                                                return updateBattleRound(battleId, currentGuessedRoundNumber, {
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
                                        // TODO check jestli jeste zbyva cas nebo ne -> jakoze uz neumoznime umistit odhad, zapiseme mu 0 vysledek
                                        // spocti rozdil mezi guessedtime a timeoutem
                                        addGuessedRoundToPlayer(battleId, myDocumentId, playerRoundGuess)
                                            .then(res => {})
                                            .catch(err => {});
                                    }
                                }
                            }}
                            type="primary"
                        >
                            Hádej!
                        </Button>
                    ) : null}
                    {!isBattle && nextRoundButtonVisible ? (
                        <Button
                            onClick={() => {
                                refreshMap();
                                if (round < TOTAL_ROUNDS_MAX) {
                                    dispatch(setTotalRoundCounter(round + 1));
                                }
                            }}
                            type="primary"
                        >
                            Další kolo
                        </Button>
                    ) : null}
                </>
            )}
        </>
    );
};

export default GuessingMap;
