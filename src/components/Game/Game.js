import React, { useContext, useEffect, useState } from 'react';
import { Modal, Progress, Button, Typography } from 'antd';
import GuessingMap from '../GuessingMap';
import { crCities } from '../../data/cr';
import MapyContext from '../../context/MapyContext';
import { pointInCircle, roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import useWindowHeight from '../../hooks/useWindowHeight';
import useSMapResize from '../../hooks/useSMapResize';

const { Title, Paragraph, Text } = Typography;

const MIN_DISTANCE_FOR_POINTS_RANDOM = 250;
const MAX_SCORE_PERCENT = 100;
const MAX_PANORAMA_TRIES = 5;
const DEFAULT_PANORAMA_TOLERANCE = 50;

const Game = ({ location }) => {
    const windowHeight = useWindowHeight();
    const { width, height } = useSMapResize();
    const [panorama] = useState(React.createRef());
    const [panoramaScene, setPanoramaScene] = useState(null);
    const [totalRoundScore, setTotalRoundScore] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [roundScore, setRoundScore] = useState(0);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [guessedPoints, setGuessedPoints] = useState([]);
    const mapyContext = useContext(MapyContext);
    const [panoramaFounded, setPanoramaFounded] = useState(true);
    const [currentCity, setCurrentCity] = useState(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);

    const checkPanoramaFounded = () => {
        setPanoramaFounded(false);
    };

    const loadPanoramaMap = (radius, locationCity, rerender, counter = 0, panoramaSceneParam = null) => {
        if (rerender && counter === 0) {
            while (panorama.current.firstChild) {
                panorama.current.firstChild.remove();
            }
        }
        const options = {
            nav: true,
            blend: 300,
            pitchRange: [0, 0], // zakazeme vertikalni rozhled
        };
        const SMap = mapyContext.SMap;

        if (SMap) {
            const SMap = mapyContext.SMap;
            let panoramaSceneSMap;
            if (panoramaSceneParam) {
                panoramaSceneSMap = panoramaSceneParam;
            } else {
                panoramaSceneSMap = new SMap.Pano.Scene(panorama.current, options);
            }
            // kolem teto pozice chceme nejblizsi panorama
            const generatedPanoramaPlace = generatePlaceInRadius(radius, locationCity);
            const position = SMap.Coords.fromWGS84(generatedPanoramaPlace.longitude, generatedPanoramaPlace.latitude);
            // hledame s toleranci 50m
            let tolerance = DEFAULT_PANORAMA_TOLERANCE;
            if (counter > 0) {
                tolerance = 5000;
            }
            SMap.Pano.getBest(position, tolerance)
                .then(
                    function(place) {
                        panoramaSceneSMap.show(place);
                        setPanoramaScene(panoramaSceneSMap);
                    },
                    function() {
                        // alert('GuessingMap se nepodařilo zobrazit!');
                        if (counter < MAX_PANORAMA_TRIES) {
                            counter = counter + 1;
                            loadPanoramaMap(radius, locationCity, true, counter, panoramaSceneSMap);
                        } else {
                            throw new Error('Panorama was not found');
                        }
                    },
                )
                .catch(err => {
                    checkPanoramaFounded(false);
                });
        }
    };

    const generateRandomCzechPlace = () => {
        let randomCity = crCities[Math.floor(Math.random() * crCities.length)];
        randomCity = {
            ...randomCity,
            coordinates: {
                latitude: randomCity.latitude,
                longitude: randomCity.longitude,
            },
        };
        setCurrentCity(randomCity);
        return randomCity;
    };

    const generatePlaceInRadius = (radius, locationCity) => {
        radius = radius * 1000; // to meters
        const generatedPlace = pointInCircle(
            {
                longitude: locationCity.coordinates.longitude,
                latitude: locationCity.coordinates.latitude,
            },
            radius,
        );
        return generatedPlace;
    };

    const calculateDistance = mapCoordinates => {
        const locationObject = location.state;
        let city = location.state.city;
        if (!city) {
            city = currentCity;
        }
        const panoramaCoordinates = panoramaScene._place._data.mark;
        let distance;
        if (panoramaCoordinates.lat === mapCoordinates.mapLat && panoramaCoordinates.lon === mapCoordinates.mapLon) {
            distance = 0;
        } else {
            const radlat1 = (Math.PI * panoramaCoordinates.lat) / 180;
            const radlat2 = (Math.PI * mapCoordinates.mapLat) / 180;
            const theta = panoramaCoordinates.lon - mapCoordinates.mapLon;
            const radtheta = (Math.PI * theta) / 180;
            let dist =
                Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344; // convert to kilometers
            distance = dist;
        }
        if (locationObject.mode === 'random') {
            const { obec, okres, kraj } = city;
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
        let { radius, mode } = location.state;
        let minDistanceForPoints;
        if (mode === 'random') {
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

    useEffect(() => {
        if (location) {
            let { radius, city, mode } = location.state;
            if (mode === 'random') {
                city = generateRandomCzechPlace();
            }
            if (mapyContext.loadedMapApi) {
                loadPanoramaMap(radius, city, false);
            }
        }
        // TODO add some cleanup maybe
    }, [mapyContext.loadedMapApi, location]);

    return (
        <>
            <div className="panorama-container" style={{ height: windowHeight - 110 }}>
                {!panoramaFounded ? (
                    <p>V okruhu 5 km od vašeho místa nebylo nalezeno žádné panorama.</p>
                ) : (
                    <div ref={panorama}></div>
                )}
            </div>
            <div
                id="smap-container"
                className="smap-container"
                style={width > 960 ? { height: height / 2, width: width / 3 } : null}
            >
                {/* ty parametry jsou definovane v Panorama */}
                <GuessingMap
                    updateCalculation={updateCalculation}
                    calculateDistance={calculateDistance}
                    loadPanoramaMap={loadPanoramaMap}
                    generateRandomCzechPlace={generateRandomCzechPlace}
                    totalRoundScore={totalRoundScore}
                    totalRounds={totalRounds}
                    guessedPoints={guessedPoints}
                />
            </div>
            <Modal
                visible={resultModalVisible}
                style={{ top: 20 }}
                onOk={() => setResultModalVisible(false)}
                onCancel={() => setResultModalVisible(false)}
                footer={[
                    <div className="result-modal-button">
                        <Button key="submit" type="primary" onClick={() => setResultModalVisible(false)}>
                            Okej
                        </Button>
                    </div>,
                ]}
            >
                <Typography className="result-modal-container">
                    {totalRounds > 0 ? (
                        <div className="result-modal-container-item">
                            <Title level={2}>
                                Kolo: {totalRounds}/{TOTAL_ROUNDS_MAX}
                            </Title>
                            {guessedDistance ? (
                                <Paragraph>
                                    Vzdušná vzdálenost místa od tvého odhadu:{' '}
                                    <Text className="highlighted">{roundToTwoDecimal(guessedDistance)} km</Text>
                                </Paragraph>
                            ) : null}
                        </div>
                    ) : null}
                    {roundScore >= 0 && guessedDistance ? (
                        <div className="result-modal-container-item">
                            <Title level={3}>Přesnost v rámci kola</Title>
                            {roundScore >= 0 && guessedDistance ? <Progress percent={roundScore} /> : null}
                        </div>
                    ) : null}
                    {totalRoundScore >= 0 ? (
                        <div className="result-modal-container-item">
                            <Paragraph>
                                Průběžný počet bodů:{' '}
                                <Text className="highlighted">{roundToTwoDecimal(totalRoundScore)}</Text>
                            </Paragraph>
                        </div>
                    ) : null}
                    {guessedPlace && guessedDistance ? (
                        <div className="result-modal-container-item">
                            <Title level={4}>Bližší informace</Title>
                            <Paragraph>
                                <Text className="highlighted">Obec:</Text> {guessedPlace.obec}
                            </Paragraph>
                            <Paragraph>
                                <Text className="highlighted">Okres:</Text> {guessedPlace.okres}
                            </Paragraph>
                            <Paragraph>
                                <Text className="highlighted">Kraj:</Text> {guessedPlace.kraj}
                            </Paragraph>
                        </div>
                    ) : null}
                </Typography>
            </Modal>
        </>
    );
};

export default Game;
