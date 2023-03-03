import { useLocalStorage } from '@rehooks/local-storage';
import { Tabs } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import BattlePlayersPanel from '../components/BattlePlayersPanel';
import Panorama, { getPanoramaSceneOptions } from '../components/Panorama';
import RoundResultModal from '../components/RoundResultModal';
import MapyCzContext from '../context/MapyCzContext';
import gameModes from '../enums/modes';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import { addPanoramaPlaceToCurrentGameRounds, setTotalRoundScore } from '../redux/actions/game';
import { setLastPanoramaPlace } from '../redux/actions/pano';
import {
    findUserFromBattleByRandomTokenId,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    getRandomPlaceInRegion,
} from '../util';
import { GuessingMapContainer } from './GuessingMapContainer';

const { TabPane } = Tabs;

export const GameScreen = ({ mode, radius, city, isGameStarted = true, isBattle, noMove = false }) => {
    const dispatch = useDispatch();
    const [smapDimensionLocalStorage] = useLocalStorage('smapDimension');
    const randomUserToken = useGetRandomUserToken();
    const mapyContext = useContext(MapyCzContext);
    const refPanoramaView = useRef();
    const currentGame = useSelector(state => state.game.currentGame);
    const lastPanoramaPlaceShown = useSelector(state => state.pano);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const [mapDimension, setMapDimension] = useState(smapDimensionLocalStorage || 'normal');
    const [roundScore, setRoundScore] = useState(0);
    const [activeTabKey, setActiveTabKey] = useState('1');
    const [currentRoundISee, setCurrentRoundISee] = useState();
    const [roundGuessedDistance, setRoundGuessedDistance] = useState(null);
    const [guessedRandomPlace, setGuessedRandomPlace] = useState(null);
    const [allGuessedPoints, setAllGuessedPoints] = useState([]);
    const [currentRoundGuessedPoint, setCurrentRoundGuessedPoint] = useState();
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [panoramaScene, setPanoramaScene] = useState(null);
    const [originalPanoramaPlace, setOriginalPanoramaPlace] = useState(null);
    const [bestPanoramaPlace, setBestPanoramaPlace] = useState(null); // best panorama chosen by mapy.cz API (according to original panorama place)
    const [panoramaLoading, setPanoramaLoading] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);

    const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 1224px)',
    });

    const { totalScore, round } = currentGame;
    const { round: currentRoundNumber, rounds: currentBattleRounds, myTotalScore, players } = currentBattleInfo;

    // FIXME: to load whole map layer when the map is minimized before
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [activeTabKey]);

    useEffect(() => {
        // Do not do this for mobile - it breaks map rendering in next rounds
        if (!isMobile) {
            let roundNumber;
            if (isBattle) {
                roundNumber = currentRoundNumber;
            } else {
                roundNumber = round;
            }
            if (!roundNumber || roundNumber === 1) {
                setMapDimension('normal');
            } else {
                setMapDimension('min');
            }
        }
    }, [isBattle, currentRoundNumber, round]);

    useEffect(() => {
        if (mapyContext.loadedMapApi && isGameStarted) {
            const panoramaSceneOptions = getPanoramaSceneOptions(noMove);
            const panoScene = new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions);
            const panoramaSignals = panoScene.getSignals();
            // observer panorama scene change
            panoramaSignals.addListener(window, 'pano-change', e => {
                const scene = e.target;
                const currentPanoramaPlace = scene.getPlace();
                // eslint-disable-next-line no-underscore-dangle
                const panoramaMark = currentPanoramaPlace._data.mark;
                const { lat, lon } = panoramaMark;
                dispatch(
                    setLastPanoramaPlace({
                        lat,
                        lon,
                    }),
                );
            });
            setPanoramaScene(panoScene);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapyContext.loadedMapApi, isGameStarted, noMove]);

    // Executed when the game is started or a page is re/loaded and rounds are already generated
    useEffect(() => {
        if (isBattle) {
            if (isGameStarted && currentBattleRounds.length) {
                const currentRound = currentBattleRounds[currentRoundNumber - 1];
                const { city: cityToGuess, panoramaPlace: panoramaPlaceToGuess } = currentRound;
                if (lastPanoramaPlaceShown && lastPanoramaPlaceShown.lat && lastPanoramaPlaceShown.lon) {
                    setOriginalPanoramaPlace({
                        latitude: lastPanoramaPlaceShown.lat,
                        longitude: lastPanoramaPlaceShown.lon,
                    });
                } else {
                    setOriginalPanoramaPlace(panoramaPlaceToGuess);
                }
                setCurrentCity(cityToGuess);
                // set the current round user can see to prevent panorama rerendering after the first guess is made by somebody
                setCurrentRoundISee(currentRound.roundId);
                // load guessed points to be persistent
                const myUser = findUserFromBattleByRandomTokenId(players, randomUserToken);
                setCurrentRoundGuessedPoint(myUser[`round${currentRoundNumber}`] ?? null);
            }
        } else {
            findNewPanorama();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameStarted]);

    useEffect(() => {
        // run after the currentRoundISee is set before (when the game is started or a page is reloaded)
        if (currentBattleRounds.length && isGameStarted && currentRoundISee) {
            const currentRound = currentBattleRounds[currentRoundNumber - 1];
            const { city: cityToGuess, panoramaPlace: panoramaPlaceToGuess } = currentRound;

            // check if a new round was started
            if (currentRoundISee < currentRound.roundId) {
                handleClearBestPanoramaPlace();
                setCurrentRoundISee(currentRound.roundId);
                setOriginalPanoramaPlace(panoramaPlaceToGuess);
            }

            setCurrentCity(cityToGuess);
            // load guessed points to be persistent
            const myUser = findUserFromBattleByRandomTokenId(players, randomUserToken);
            setCurrentRoundGuessedPoint(myUser[`round${currentRoundNumber}`] ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameStarted, currentBattleRounds, currentRoundNumber, players]);

    const changeNextRoundButtonVisibility = isVisible => {
        setNextRoundButtonVisible(isVisible);
    };

    const findNewPanorama = () => {
        handleClearBestPanoramaPlace();
        if (mode === gameModes.random) {
            radius = generateRandomRadius();
            city = getRandomCzechPlace();
        }
        if (mode === gameModes.randomRegion) {
            const { regionNutCode } = currentGame;
            radius = generateRandomRadius();
            city = getRandomPlaceInRegion(regionNutCode);
        }
        setCurrentCity(city);
        const generatedPanoramaPlace = generatePlaceInRadius(radius, city);
        setOriginalPanoramaPlace(generatedPanoramaPlace);
        // mobile
        setActiveTabKey('1');
    };

    /**
     * Triggers re-render to find a new panorama
     */
    const handleClearBestPanoramaPlace = () => {
        setBestPanoramaPlace(null);
    };

    const handleSetBestPanoramaPlace = bestPanoramaPlace => {
        const data = bestPanoramaPlace._data.mark;
        const { lat, lon } = data;
        dispatch(
            addPanoramaPlaceToCurrentGameRounds({
                roundId: round,
                lat,
                lon,
                bestPanoramaPlace,
            }),
        );
        setOriginalPanoramaPlace({
            latitude: lat,
            longitude: lon,
        });
        setBestPanoramaPlace(bestPanoramaPlace);
    };

    const changePanoramaLoadingState = loading => {
        setPanoramaLoading(loading);
    };

    const saveRoundResult = (score, distance) => {
        setRoundScore(Math.round(score));
        if (isBattle) {
            dispatch(setTotalRoundScore(Math.round(myTotalScore + score)));
        } else {
            dispatch(setTotalRoundScore(Math.round(totalScore + score)));
        }
        setRoundGuessedDistance(distance);
    };

    const evaluateGuessedRound = guessedPointsInRound => {
        if (mode === gameModes.random || mode === gameModes.randomRegion) {
            const { obec, okres, kraj, coatOfArmsDescription, coatOfArmsFlagDescription } = currentCity;
            setGuessedRandomPlace({ obec, okres, kraj, coatOfArmsDescription, coatOfArmsFlagDescription });
        }
        setAllGuessedPoints([...allGuessedPoints, guessedPointsInRound]);
        setCurrentRoundGuessedPoint(guessedPointsInRound);
        setResultModalVisible(true);
    };

    return (
        <>
            {isTabletOrMobileDevice ? (
                <Tabs
                    defaultActiveKey="1"
                    centered
                    activeKey={activeTabKey}
                    onChange={activeKey => setActiveTabKey(activeKey)}
                >
                    <TabPane tab="panorama" key="1">
                        <Panorama
                            originalPanoramaPlace={originalPanoramaPlace}
                            panoramaScene={panoramaScene}
                            bestPanoramaPlace={bestPanoramaPlace}
                            refPanoramaView={refPanoramaView}
                            panoramaLoading={panoramaLoading}
                            changePanoramaLoadingState={changePanoramaLoadingState}
                            isGameStarted={isGameStarted}
                            isBattle={isBattle}
                            onSetBestPanoramaPlace={handleSetBestPanoramaPlace}
                        />
                    </TabPane>
                    <TabPane tab="mapa" key="2">
                        <GuessingMapContainer
                            isBattle={isBattle}
                            visible={isBattle ? isGameStarted : true}
                            evaluateGuessedRound={evaluateGuessedRound}
                            currentRoundGuessedPoint={currentRoundGuessedPoint}
                            panoramaLoading={panoramaLoading}
                            findNewPanorama={findNewPanorama}
                            saveRoundResult={saveRoundResult}
                            bestPanoramaPlace={bestPanoramaPlace}
                            panoramaScene={panoramaScene}
                            allGuessedPoints={allGuessedPoints}
                            isGameStarted={isGameStarted}
                            currentCity={currentCity}
                            nextRoundButtonVisible={nextRoundButtonVisible}
                            changeNextRoundButtonVisibility={changeNextRoundButtonVisibility}
                            mapDimension={mapDimension}
                        />
                    </TabPane>
                </Tabs>
            ) : (
                <>
                    <div className="game-screen-container">
                        {isBattle && <BattlePlayersPanel />}
                        <Panorama
                            originalPanoramaPlace={originalPanoramaPlace}
                            bestPanoramaPlace={bestPanoramaPlace}
                            panoramaScene={panoramaScene}
                            refPanoramaView={refPanoramaView}
                            panoramaLoading={panoramaLoading}
                            changePanoramaLoadingState={changePanoramaLoadingState}
                            isGameStarted={isGameStarted}
                            isBattle={isBattle}
                            onSetBestPanoramaPlace={handleSetBestPanoramaPlace}
                        />
                    </div>
                    <GuessingMapContainer
                        isBattle={isBattle}
                        visible={isBattle ? isGameStarted : true}
                        evaluateGuessedRound={evaluateGuessedRound}
                        currentRoundGuessedPoint={currentRoundGuessedPoint}
                        panoramaLoading={panoramaLoading}
                        findNewPanorama={findNewPanorama}
                        saveRoundResult={saveRoundResult}
                        bestPanoramaPlace={bestPanoramaPlace}
                        panoramaScene={panoramaScene}
                        allGuessedPoints={allGuessedPoints}
                        isGameStarted={isGameStarted}
                        currentCity={currentCity}
                        nextRoundButtonVisible={nextRoundButtonVisible}
                        changeNextRoundButtonVisibility={changeNextRoundButtonVisibility}
                        mapDimension={mapDimension}
                        onSetMapDimension={dimension => setMapDimension(dimension)}
                    />
                </>
            )}
            <RoundResultModal
                visible={resultModalVisible}
                closeModal={() => setResultModalVisible(false)}
                roundGuessedDistance={roundGuessedDistance}
                roundScore={roundScore}
                totalRoundScore={totalScore}
                isBattle={isBattle}
                guessedRandomPlace={guessedRandomPlace}
            />
        </>
    );
};
