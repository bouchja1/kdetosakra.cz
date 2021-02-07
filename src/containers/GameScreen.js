import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import 'react-resizable/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import GuessingMap from '../components/GuessingMap';
import MapyCzContext from '../context/MapyCzContext';
import { setTotalRoundScore } from '../redux/actions/game';
import useSMapResize from '../hooks/useSMapResize';
import Panorama, { panoramaSceneOptions } from '../components/Panorama';
import { generatePlaceInRadius, generateRandomRadius, getRandomCzechPlace } from '../util';
import RoundResultModal from '../components/RoundResultModal';
import gameModes from '../enums/modes';
import BattleUsers from '../components/BattleUsers';

export const GameScreen = ({
    mode, radius, city, isGameStarted = true, isBattle,
}) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const { width, height } = useSMapResize();
    const refPanoramaView = useRef();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const [panoramaScene, setPanoramaScene] = useState(null);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [panoramaPlace, setPanoramaPlace] = useState(null);
    const [panoramaLoading, setPanoramaLoading] = useState(false);

    const { round, totalScore } = currentGame;
    const { round: lastGuessedRound, rounds } = currentBattleInfo;

    useEffect(() => {
        if (mapyContext.loadedMapApi && isGameStarted) {
            setPanoramaScene(new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi, isGameStarted]);

    useEffect(() => {
        if (isBattle) {
            if (rounds.length && isGameStarted) {
                const roundToGuess = rounds[lastGuessedRound];
                const { city: cityToGuess, panoramaPlace: panoramaPlaceToGuess } = roundToGuess;
                setPanoramaPlace(panoramaPlaceToGuess);
                setCurrentCity(cityToGuess);
            }
        } else {
            if (mode === gameModes.random) {
                city = getRandomCzechPlace();
            }
            // init panorama
            if (radius && city) {
                setPanoramaPlace(generatePlaceInRadius(radius, city));
                setCurrentCity(city);
            }
        }
    }, [mapyContext.loadedMapApi, mode, radius, city, isBattle, isGameStarted, rounds, lastGuessedRound]);

    const makeSetPanoramaLoading = loading => {
        setPanoramaLoading(loading);
    };

    const makeRefreshPanorama = () => {
        setPanoramaLoading(true);
        if (mode === gameModes.random) {
            radius = generateRandomRadius();
            city = getRandomCzechPlace();
        }
        setCurrentCity(city);
        const generatedPanoramaPlace = generatePlaceInRadius(radius, city);
        setPanoramaPlace(generatedPanoramaPlace);
    };

    const makeRoundResult = (score, distance) => {
        setRoundScore(Math.round(score));
        dispatch(setTotalRoundScore(Math.round(totalScore + score)));
        setGuessedDistance(distance);
    };

    const closeModal = () => {
        setResultModalVisible(false);
    };

    const makeCountScore = guessedPointsInRound => {
        setGuessedPoints([...guessedPoints, guessedPointsInRound]);
        setResultModalVisible(true);
    };

    const makeGuessedPlace = () => {
        const { obec, okres, kraj } = currentCity;
        setGuessedPlace({ obec, okres, kraj });
    };

    return (
        <>
            <div className="game-screen-container">
                {isBattle && <BattleUsers />}
                <Panorama
                    panoramaPlace={panoramaPlace}
                    makeRefreshPanorama={makeRefreshPanorama}
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
            <div
                id="smap-container"
                className="smap-container"
                style={width > 960 ? { height: height / 2, width: width / 3 } : null}
            >
                <GuessingMap
                    makeCountScore={makeCountScore}
                    makeRefreshPanorama={makeRefreshPanorama}
                    totalRounds={round}
                    guessedPoints={guessedPoints}
                    gameMode={mode}
                    panoramaScene={panoramaScene}
                    makeRoundResult={makeRoundResult}
                    makeGuessedPlace={makeGuessedPlace}
                    panoramaLoading={panoramaLoading}
                    isGameStarted={isGameStarted}
                    isBattle={isBattle}
                    currentCity={currentCity}
                />
            </div>
            <RoundResultModal
                visible={resultModalVisible}
                closeModal={closeModal}
                totalRounds={round}
                guessedDistance={guessedDistance}
                roundScore={roundScore}
                totalRoundScore={totalScore}
                guessedPlace={guessedPlace}
            />
        </>
    );
};
