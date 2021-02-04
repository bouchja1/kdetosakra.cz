import React, { useContext, useEffect, useState } from 'react';
import GuessingMap from '../components/GuessingMap';
import { crCities } from '../data/cr';
import KdetosakraContext from '../context/KdetosakraContext';
import { MAX_SCORE_PERCENT, MIN_DISTANCE_FOR_POINTS_RANDOM } from '../constants/game';
import useSMapResize from '../hooks/useSMapResize';
import Panorama from '../components/Panorama';
import { generateRandomRadius } from '../util';
import RoundResultModal from '../components/RoundResultModal';
import gameModes from '../enums/modes';

const getRandomCzechPlace = () => {
    let randomCity = crCities[Math.floor(Math.random() * crCities.length)];
    randomCity = {
        ...randomCity,
        coordinates: {
            latitude: randomCity.latitude,
            longitude: randomCity.longitude,
        },
    };
    return randomCity;
};

export const GameScreen = ({ location }) => {
    const mapyContext = useContext(KdetosakraContext);
    const { width, height } = useSMapResize();

    const [panoramaScene, setPanoramaScene] = useState(null);
    const [totalRoundScore, setTotalRoundScore] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const [currentCity, setCurrentCity] = useState(null);
    const [currentRadius, setCurrentRadius] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [refreshPanorama, setRefreshPanorama] = useState(false);

    useEffect(() => {
        if (location?.state) {
            let { city } = location.state;
            const { radius, mode } = location.state;
            if (mode === gameModes.random) {
                city = getRandomCzechPlace();
            }
            setCurrentCity(city);
            setCurrentRadius(radius);
        }
        // TODO add some cleanup maybe
    }, [mapyContext.loadedMapApi, location]);

    const makeRefreshPanorama = () => {
        let { radius, city, mode } = location.state;
        if (mode === gameModes.random) {
            radius = generateRandomRadius();
            city = getRandomCzechPlace();
        }
        setCurrentCity(city);
        setCurrentRadius(radius);
        setRefreshPanorama(true);
    };

    const makePanoramaScene = scene => {
        setPanoramaScene(scene);
    };

    const closeModal = () => {
        setResultModalVisible(false);
    };

    const calculateDistance = mapCoordinates => {
        const locationObject = location.state;
        // eslint-disable-next-line no-underscore-dangle
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if (panoramaCoordinates.lat === mapCoordinates.mapLat && panoramaCoordinates.lon === mapCoordinates.mapLon) {
            distance = 0;
        } else {
            const radlat1 = (Math.PI * panoramaCoordinates.lat) / 180;
            const radlat2 = (Math.PI * mapCoordinates.mapLat) / 180;
            const theta = panoramaCoordinates.lon - mapCoordinates.mapLon;
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
        if (locationObject.mode === gameModes.random) {
            const { obec, okres, kraj } = currentCity;
            setGuessedPlace({
                obec,
                okres,
                kraj,
            });
        }
        calculateScore(distance);
        return panoramaCoordinates;
    };

    const calculateScore = distance => {
        const { radius, mode } = location.state;
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
        setRoundScore(Math.round(score));
        setTotalRoundScore(prevScore => Math.round(prevScore + score));
        setTotalRounds(prevRoundCount => prevRoundCount + 1);
        setGuessedDistance(distance);
    };

    const updateCalculation = guessedPointsInRound => {
        setGuessedPoints([...guessedPoints, guessedPointsInRound]);
        setResultModalVisible(true);
    };

    return (
        <>
            <Panorama
                city={currentCity}
                radius={currentRadius}
                refresh={refreshPanorama}
                makeRefreshPanorama={makeRefreshPanorama}
                panoramaScene={panoramaScene}
                makePanoramaScene={makePanoramaScene}
            />
            <div
                id="smap-container"
                className="smap-container"
                style={width > 960 ? { height: height / 2, width: width / 3 } : null}
            >
                {/* ty parametry jsou definovane v Panorama */}
                <GuessingMap
                    updateCalculation={updateCalculation}
                    calculateDistance={calculateDistance}
                    makeRefreshPanorama={makeRefreshPanorama}
                    totalRoundScore={totalRoundScore}
                    totalRounds={totalRounds}
                    guessedPoints={guessedPoints}
                    gameMode={location.state.mode}
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
