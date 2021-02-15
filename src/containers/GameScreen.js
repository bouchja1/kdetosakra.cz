import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalStorage } from '@rehooks/local-storage';
import MapyCzContext from '../context/MapyCzContext';
import { setTotalRoundScore } from '../redux/actions/game';
import Panorama, { panoramaSceneOptions } from '../components/Panorama';
import {
    findUserFromBattleByRandomTokenId,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
} from '../util';
import RoundResultModal from '../components/RoundResultModal';
import gameModes from '../enums/modes';
import BattlePlayersPanel from '../components/BattlePlayersPanel';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import { GuessingMapContainer } from './GuessingMapContainer';

export const GameScreen = ({
    mode, radius, city, isGameStarted = true, isBattle,
}) => {
    const dispatch = useDispatch();
    const randomUserToken = useGetRandomUserToken();
    const mapyContext = useContext(MapyCzContext);
    const refPanoramaView = useRef();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [smapVisibleLocalStorageValue] = useLocalStorage('smapVisible');

    const [panoramaScene, setPanoramaScene] = useState(null);
    const [roundScore, setRoundScore] = useState(0);
    const [roundGuessedDistance, setRoundGuessedDistance] = useState(null);
    const [guessedRandomPlace, setGuessedRandomPlace] = useState(null);
    const [allGuessedPoints, setAllGuessedPoints] = useState([]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            findNewPanorama();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapyContext.loadedMapApi, isGameStarted, rounds, lastGuessedRound, players, randomUserToken, isBattle]);

    const findNewPanorama = () => {
        if (mode === gameModes.random) {
            radius = generateRandomRadius();
            city = getRandomCzechPlace();
        }
        setCurrentCity(city);
        const generatedPanoramaPlace = generatePlaceInRadius(radius, city);
        setPanoramaPlace(generatedPanoramaPlace);
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
        if (mode === gameModes.random) {
            const { obec, okres, kraj } = currentCity;
            setGuessedRandomPlace({ obec, okres, kraj });
        }
        setAllGuessedPoints([...allGuessedPoints, guessedPointsInRound]);
        setCurrentRoundGuessedPoint(guessedPointsInRound);
        setResultModalVisible(true);
    };

    return (
        <>
            <div className="game-screen-container">
                {isBattle && <BattlePlayersPanel />}
                <Panorama
                    panoramaPlace={panoramaPlace}
                    panoramaScene={panoramaScene}
                    refPanoramaView={refPanoramaView}
                    panoramaLoading={panoramaLoading}
                    changePanoramaLoadingState={changePanoramaLoadingState}
                    isGameStarted={isGameStarted}
                />
            </div>
            <GuessingMapContainer
                maximized={isSMapVisible}
                isBattle={isBattle}
                visible={isBattle ? isGameStarted && isSMapVisible : isSMapVisible}
                evaluateGuessedRound={evaluateGuessedRound}
                currentRoundGuessedPoint={currentRoundGuessedPoint}
                panoramaLoading={panoramaLoading}
                findNewPanorama={findNewPanorama}
                saveRoundResult={saveRoundResult}
                panoramaScene={panoramaScene}
                allGuessedPoints={allGuessedPoints}
                isGameStarted={isGameStarted}
                currentCity={currentCity}
            />
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
