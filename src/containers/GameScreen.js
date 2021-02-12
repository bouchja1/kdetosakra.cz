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
import BattlePlayersPanel from '../components/BattlePlayersPanel';

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
    const { round: lastGuessedRound, rounds, myTotalScore } = currentBattleInfo;

    useEffect(() => {
        if (mapyContext.loadedMapApi && isGameStarted) {
            setPanoramaScene(new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi, isGameStarted]);

    useEffect(() => {
        if (isBattle) {
            if (rounds.length && isGameStarted) {
                const roundToGuess = rounds[lastGuessedRound - 1];
                const { city: cityToGuess, panoramaPlace: panoramaPlaceToGuess } = roundToGuess;
                setPanoramaPlace(panoramaPlaceToGuess);
                setCurrentCity(cityToGuess);
            }
        } else {
            makeFindNewPanorama();
        }
    }, [mapyContext.loadedMapApi, isGameStarted, rounds, lastGuessedRound]);

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
        setResultModalVisible(true);
    };

    const makeGuessedPlace = () => {
        const { obec, okres, kraj } = currentCity;
        setGuessedPlace({ obec, okres, kraj });
    };

    return (
        <>
            <div className="game-screen-container">
                {isBattle && <BattlePlayersPanel />}
                <Panorama
                    panoramaPlace={panoramaPlace}
                    makeFindNewPanorama={makeFindNewPanorama}
                    panoramaScene={panoramaScene}
                    refPanoramaView={refPanoramaView}
                    panoramaLoading={panoramaLoading}
                    makeSetPanoramaLoading={makeSetPanoramaLoading}
                    isGameStarted={isGameStarted}
                    isBattle={isBattle}
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
                    makeFindNewPanorama={makeFindNewPanorama}
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
                guessedDistance={guessedDistance}
                roundScore={roundScore}
                totalRoundScore={totalScore}
                isBattle={isBattle}
                guessedPlace={guessedPlace}
            />
        </>
    );
};
