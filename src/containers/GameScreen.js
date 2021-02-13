import React, {
    useContext, useEffect, useRef, useState, useMemo
} from 'react';
import 'react-resizable/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import GuessingMap from '../components/GuessingMap';
import MapyCzContext from '../context/MapyCzContext';
import maximizeMapShadow from '../assets/images/map/maximizeMapShadow.png';
import minimizeMapShadow from '../assets/images/map/minimizeMapShadow.png';
import { setTotalRoundScore } from '../redux/actions/game';
import useSMapResize from '../hooks/useSMapResize';
import Panorama, { panoramaSceneOptions } from '../components/Panorama';
import {
    findUserFromBattleByRandomTokenId,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    getUnixTimestamp,
} from '../util';
import RoundResultModal from '../components/RoundResultModal';
import gameModes from '../enums/modes';
import BattlePlayersPanel from '../components/BattlePlayersPanel';
import { updateBattle } from '../services/firebase';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';

export const GameScreen = ({
    mode, radius, city, isGameStarted = true, isBattle,
}) => {
    const dispatch = useDispatch();
    const randomUserToken = useGetRandomUserToken();
    const mapyContext = useContext(MapyCzContext);
    const { width, height } = useSMapResize();
    const refPanoramaView = useRef();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [smapVisibleLocalStorageValue] = useLocalStorage('smapVisible');

    const refLayerValue = useRef();
    const refVectorLayerSMapValue = useRef();

    const [panoramaScene, setPanoramaScene] = useState(null);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const [currentRoundGuessedPoint, setCurrentRoundGuessedPoint] = useState();
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [panoramaPlace, setPanoramaPlace] = useState(null);
    const [panoramaLoading, setPanoramaLoading] = useState(false);
    const [isSMapVisible, setIsSMapVisible] = useState();

    const { totalScore } = currentGame;
    const {
        round: lastGuessedRound, rounds, myTotalScore, players,
    } = currentBattleInfo;

    // FIXME: to load whole map layer when the map is minimized before
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    useEffect(() => {
        if (mapyContext.loadedMapApi && isGameStarted) {
            setPanoramaScene(new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi, isGameStarted]);

    useEffect(() => {
        const localStorageBooleanValue = !!smapVisibleLocalStorageValue;
        setIsSMapVisible(smapVisibleLocalStorageValue === null ? true : localStorageBooleanValue);
    }, [smapVisibleLocalStorageValue]);

    useEffect(() => {
        if (isBattle) {
            if (rounds.length && isGameStarted) {
                const roundToGuess = rounds[lastGuessedRound - 1];
                const { city: cityToGuess, panoramaPlace: panoramaPlaceToGuess } = roundToGuess;
                setPanoramaPlace(panoramaPlaceToGuess);
                setCurrentCity(cityToGuess);
                // load guessed points to be persistent
                const myUser = findUserFromBattleByRandomTokenId(players, randomUserToken);
                setCurrentRoundGuessedPoint(myUser[`round${lastGuessedRound}`] ?? null);
            }
        } else {
            makeFindNewPanorama();
        }
    }, [mapyContext.loadedMapApi, isGameStarted, rounds, lastGuessedRound, players]);

    const getSMapCollapseMax = () => {
        if (width > 960) {
            if (!isSMapVisible || (isBattle && !isGameStarted)) {
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

    const makeFindNewPanorama = () => {
        setPanoramaLoading(true);
        if (mode === gameModes.random) {
            radius = generateRandomRadius();
            city = getRandomCzechPlace();
        }
        setCurrentCity(city);
        const generatedPanoramaPlace = generatePlaceInRadius(radius, city);
        setPanoramaPlace(generatedPanoramaPlace);
    };

    const makeStartNextBattleRound = (updatedBattleId, nextRoundNumber) => {
        updateBattle(updatedBattleId, {
            currentRoundStart: getUnixTimestamp(new Date()),
            round: nextRoundNumber,
        })
            .then(docRef => {})
            .catch(err => {
                console.log('NOOOOOOO ERROR: ', err);
            });
    };

    const makeSetPanoramaLoading = loading => {
        setPanoramaLoading(loading);
    };

    const makeRoundResult = (score, distance) => {
        setRoundScore(Math.round(score));
        if (isBattle) {
            dispatch(setTotalRoundScore(Math.round(myTotalScore + score)));
        } else {
            dispatch(setTotalRoundScore(Math.round(totalScore + score)));
        }
        setGuessedDistance(distance);
    };

    const closeModal = () => {
        setResultModalVisible(false);
    };

    const makeCountScore = guessedPointsInRound => {
        setGuessedPoints([...guessedPoints, guessedPointsInRound]);
        setCurrentRoundGuessedPoint(guessedPointsInRound);
        setResultModalVisible(true);
    };

    const makeGuessedPlace = () => {
        const { obec, okres, kraj } = currentCity;
        setGuessedPlace({ obec, okres, kraj });
    };

    return (
        <>
            <div className="game-screen-container">
                {isBattle && <BattlePlayersPanel makeStartNextBattleRound={makeStartNextBattleRound} />}
                <Panorama
                    panoramaPlace={panoramaPlace}
                    panoramaScene={panoramaScene}
                    refPanoramaView={refPanoramaView}
                    panoramaLoading={panoramaLoading}
                    makeSetPanoramaLoading={makeSetPanoramaLoading}
                    isGameStarted={isGameStarted}
                />
            </div>
            {/*
                <img id="kdetosakra-logo" src={smilingLogo} alt="logo" className="kdetosakra-logo" width="15%" />
                */}
            <div id="smap-container" className="smap-container" style={getSMapCollapseMax()}>
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
                <img
                    className="smap-collapsible-max"
                    src={minimizeMapShadow}
                    onClick={() => writeStorage('smapVisible', false)}
                />
                <GuessingMap
                    makeCountScore={makeCountScore}
                    makeFindNewPanorama={makeFindNewPanorama}
                    guessedPoints={guessedPoints}
                    currentRoundGuessedPoint={currentRoundGuessedPoint}
                    gameMode={mode}
                    panoramaScene={panoramaScene}
                    makeRoundResult={makeRoundResult}
                    makeGuessedPlace={makeGuessedPlace}
                    panoramaLoading={panoramaLoading}
                    isGameStarted={isGameStarted}
                    isBattle={isBattle}
                    currentCity={currentCity}
                    refLayerValue={refLayerValue}
                    refVectorLayerSMapValue={refVectorLayerSMapValue}
                />
            </div>
            {!isSMapVisible && (
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
            <RoundResultModal
                visible={resultModalVisible}
                closeModal={closeModal}
                guessedDistance={guessedDistance}
                roundScore={roundScore}
                totalRoundScore={totalScore}
                isBattle={isBattle}
                guessedPlace={guessedPlace}
            />
        </>
    );
};
