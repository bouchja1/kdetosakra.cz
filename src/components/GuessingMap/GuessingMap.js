import React, { useState, useContext } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';
import { Button } from 'antd';
import MapyContext from '../../context/MapyContext';
import NextRoundButton from '../NextRoundButton';
import { DEFAUL_MARKER_PLACE_ICON, DEFAUL_MARKER_ICON, roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import RoundSMapWrapper from '../SMap/RoundSMapWrapper';
import { saveRandomScore, saveCityScore } from '../../services/api';

const GuessingMap = ({
    updateCalculation,
    calculateDistance,
    loadPanoramaMap,
    generateRandomCzechPlace,
    totalRoundScore,
    totalRounds,
    guessedPoints,
}) => {
    const location = useLocation();
    const [randomUserResultToken] = useLocalStorage('randomUserResultToken'); // send the key to be tracked.
    const mapyContext = useContext(MapyContext);
    const [layeredMap] = useState(null);
    const [layer] = useState(null);
    const [vectorLayerSMap] = useState(null);
    const [gameCompleted, setGameCompleted] = useState(false);

    let refLayerValue = React.useRef(layer);
    let refVectorLayerSMapValue = React.useRef(vectorLayerSMap);
    let refLayeredMapValue = React.useRef(layeredMap);

    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    const [guessedCoordinates, setGuessedCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    /**
     * Refresh map for a new guessing!
     */
    const refreshMap = () => {
        let { radius, city, mode } = location.state;
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        setNextRoundButtonVisible(false);
        setGuessButtonDisabled(true);
        if (mode === 'random') {
            city = generateRandomCzechPlace();
        }
        loadPanoramaMap(radius, city, true);
    };

    const click = (e, elm) => {
        // Došlo ke kliknutí, spočítáme kde
        const options = {
            url: DEFAUL_MARKER_ICON,
            anchor: { left: 10, bottom: 1 } /* Ukotvení značky za bod uprostřed dole */,
        };
        // state is not working in event handling
        //if (guessButtonDisabled && refLayerValue.current && !nextRoundButtonVisible) {
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

    const resolveRounds = () => {
        setGameCompleted(true);
    };

    const storeResult = () => {
        const locationObj = location.state;
        const percent = roundToTwoDecimal(totalRoundScore / TOTAL_ROUNDS_MAX);
        if (randomUserResultToken && locationObj) {
            if (locationObj.mode === 'random') {
                saveRandomScore(randomUserResultToken, percent).catch(err => {
                    // we ignore this
                });
            } else if (locationObj.mode === 'city') {
                saveCityScore(locationObj.city.name, randomUserResultToken, percent).catch(err => {
                    // we ignore this
                });
            }
        }
    };

    const renderGuessingMapButtons = () => {
        if (gameCompleted) {
            storeResult();
            return (
                <Redirect
                    to={{
                        pathname: '/vysledek',
                        state: {
                            totalRoundScore,
                            guessedPoints,
                        },
                    }}
                />
            );
        }
        if (totalRounds >= TOTAL_ROUNDS_MAX) {
            return (
                <Button
                    onClick={() => {
                        resolveRounds();
                    }}
                    type="primary"
                >
                    Vyhodnotit hru
                </Button>
            );
        } else {
            return (
                <div>
                    {!nextRoundButtonVisible ? (
                        <Button
                            disabled={guessButtonDisabled}
                            onClick={() => {
                                calculateCoords();
                            }}
                            type="primary"
                        >
                            Hádej!
                        </Button>
                    ) : null}
                    {nextRoundButtonVisible ? <NextRoundButton refreshMap={() => refreshMap()} /> : null}
                </div>
            );
        }
    };

    const calculateCoords = () => {
        const markerPanoramaOptions = {
            url: DEFAUL_MARKER_PLACE_ICON,
            anchor: { left: 10, bottom: 15 },
        };
        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);

        const panoramaCoordinates = calculateDistance(guessedCoordinates);

        const pointPanorama = mapyContext.SMap.Coords.fromWGS84(panoramaCoordinates.lon, panoramaCoordinates.lat);
        const pointMap = mapyContext.SMap.Coords.fromWGS84(guessedCoordinates.mapLon, guessedCoordinates.mapLat);

        const guessedVectorPathCoordinates = [pointPanorama, pointMap];
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
            `Panorama point`,
            markerPanoramaOptions,
        );
        refLayerValue.current.addMarker(markerPanorama);
        updateCalculation({ pointPanorama, pointMap });
    };

    return (
        <div>
            <RoundSMapWrapper
                click={click}
                refLayeredMapValue={refLayeredMapValue}
                refLayerValue={refLayerValue}
                refVectorLayerSMapValue={refVectorLayerSMapValue}
            />
            {renderGuessingMapButtons()}
        </div>
    );
};

export default GuessingMap;
