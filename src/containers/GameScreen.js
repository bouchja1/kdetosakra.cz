import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import GuessingMap from '../components/GuessingMap';
import KdetosakraContext from '../context/KdetosakraContext';
import useSMapResize from '../hooks/useSMapResize';
import Panorama, { panoramaSceneOptions } from '../components/Panorama';
import { generatePlaceInRadius, generateRandomRadius, getRandomCzechPlace } from '../util';
import RoundResultModal from '../components/RoundResultModal';
import gameModes from '../enums/modes';

export const GameScreen = ({ location }) => {
    const mapyContext = useContext(KdetosakraContext);
    const { width, height } = useSMapResize();
    const refPanoramaView = useRef();

    const [panoramaScene, setPanoramaScene] = useState(null);
    const [totalRoundScore, setTotalRoundScore] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [panoramaPlace, setPanoramaPlace] = useState(null);
    const [panoramaLoading, setPanoramaLoading] = useState(false);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            setPanoramaScene(new mapyContext.SMap.Pano.Scene(refPanoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi]);

    useEffect(() => {
        if (location?.state) {
            let { city } = location.state;
            const { radius, mode } = location.state;
            if (mode === gameModes.random) {
                city = getRandomCzechPlace();
            }
            // init panorama
            setPanoramaPlace(generatePlaceInRadius(radius, city));
            setCurrentCity(city);
        }
        // TODO add some cleanup maybe
    }, [mapyContext.loadedMapApi, location]);

    const makeSetPanoramaLoading = loading => {
        setPanoramaLoading(loading);
    };

    const makeRefreshPanorama = () => {
        setPanoramaLoading(true);
        let { radius, city, mode } = location.state;
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
        setTotalRoundScore(prevScore => Math.round(prevScore + score));
        setTotalRounds(prevRoundCount => prevRoundCount + 1);
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
            <div
                id="smap-container"
                className="smap-container"
                style={width > 960 ? { height: height / 2, width: width / 3 } : null}
            >
                <GuessingMap
                    makeCountScore={makeCountScore}
                    makeRefreshPanorama={makeRefreshPanorama}
                    totalRoundScore={totalRoundScore}
                    totalRounds={totalRounds}
                    guessedPoints={guessedPoints}
                    gameMode={location.state.mode}
                    panoramaScene={panoramaScene}
                    makeRoundResult={makeRoundResult}
                    makeGuessedPlace={makeGuessedPlace}
                    panoramaLoading={panoramaLoading}
                />
            </div>
            <RoundResultModal
                visible={resultModalVisible}
                closeModal={closeModal}
                totalRounds={totalRounds}
                guessedDistance={guessedDistance}
                roundScore={roundScore}
                totalRoundScore={totalRoundScore}
                guessedPlace={guessedPlace}
            />
        </>
    );
};
