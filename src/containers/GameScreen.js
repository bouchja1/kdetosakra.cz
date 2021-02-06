import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { ResizableBox } from 'react-resizable';
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

export const GameScreen = ({ mode, radius, city }) => {
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const { width, height } = useSMapResize();
    const refPanoramaView = useRef();
    const currentGame = useSelector(state => state.game.currentGame);

    const [mapSize, setMapSize] = useState();
    const [panoramaScene, setPanoramaScene] = useState(null);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [panoramaPlace, setPanoramaPlace] = useState(null);
    const [panoramaLoading, setPanoramaLoading] = useState(false);

    const [defaultDimensions, setDefaultDimensions] = useState(null);
    const [resizeWidth, setResizeWidth] = useState();
    const [resizeHeight, setResizeHeight] = useState();

    const { round, totalScore } = currentGame;

    useEffect(() => {
        const defaultWindowBasedDimensions = width > 960 ? { height: height / 2, width: width / 3 } : null;
        setResizeWidth(defaultWindowBasedDimensions?.width ?? window.innerWidth);
        setResizeHeight(defaultWindowBasedDimensions?.height ?? window.innerWidth);
        setDefaultDimensions(defaultWindowBasedDimensions);
    }, [width]);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            setPanoramaScene(new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi]);

    useEffect(() => {
        if (mode === gameModes.random) {
            city = getRandomCzechPlace();
        }
        // init panorama
        setPanoramaPlace(generatePlaceInRadius(radius, city));
        setCurrentCity(city);
    }, [mapyContext.loadedMapApi, mode, radius, city]);

    const handleMapResize = (event, { size }) => {
        setMapSize(size);
        setResizeHeight(size.height);
        setResizeWidth(size.width);
    };

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
            <Panorama
                panoramaPlace={panoramaPlace}
                makeRefreshPanorama={makeRefreshPanorama}
                panoramaScene={panoramaScene}
                refPanoramaView={refPanoramaView}
                panoramaLoading={panoramaLoading}
                makeSetPanoramaLoading={makeSetPanoramaLoading}
            />
            {/*
                <img id="kdetosakra-logo" src={smilingLogo} alt="logo" className="kdetosakra-logo" width="15%" />
                */}
            <div
                id="smap-container"
                className="smap-container"
                style={{ height: `calc(${resizeHeight}px + 0px)`, width: `calc(${resizeWidth}px + 0px)` }}
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
                    mapSize={mapSize}
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
