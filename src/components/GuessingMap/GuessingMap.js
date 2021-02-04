import React, { useState, useContext, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLocalStorage } from '@rehooks/local-storage';
import { Button } from 'antd';
import KdetosakraContext from '../../context/KdetosakraContext';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { storeResult } from '../../util/result';
import { DEFAUL_MARKER_PLACE_ICON, DEFAUL_MARKER_ICON } from '../../constants/icons';
import { RoundSMapWrapper } from '../SMap/RoundSMapWrapper';
import { ResultSMapWrapper } from '../SMap/ResultSMapWrapper';

const GuessingMap = ({
    updateCalculation,
    calculateDistance,
    makeRefreshPanorama,
    totalRoundScore,
    totalRounds,
    guessedPoints,
}) => {
    const mapyContext = useContext(KdetosakraContext);
    const location = useLocation();
    const [randomUserResultToken] = useLocalStorage('randomUserResultToken'); // send the key to be tracked.

    const [roundGuessed, setRoundGuessed] = useState(false);

    const refLayerValue = useRef();
    const refVectorLayerSMapValue = useRef();
    const refLayeredMapValue = useRef();

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
        makeRefreshPanorama(); // TODO tohle mam pocit, ze nekdy kurvi - ve smyslu, ze to nekdy nepregeneruje mapu - mozna budu muset cekat na promise?
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        setNextRoundButtonVisible(false);
        setGuessButtonDisabled(true);
        setRoundGuessed(false);
        window.scrollTo(0, 0);
    };

    const clickMapPoint = (e, elm) => {
        // Došlo ke kliknutí, spočítáme kde
        const options = {
            url: DEFAUL_MARKER_ICON,
            anchor: { left: 10, bottom: 1 } /* Ukotvení značky za bod uprostřed dole */,
        };
        // state is not working in event handling
        // if (guessButtonDisabled && refLayerValue.current && !nextRoundButtonVisible) {
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

    const getMapButton = () => {
        if (totalRounds >= TOTAL_ROUNDS_MAX) {
            return (
                <Button
                    type="primary"
                    onClick={() => storeResult(
                            location?.state?.mode,
                            location?.state?.city.name,
                            totalRoundScore,
                            randomUserResultToken,
                    )}
                >
                    <Link
                        to={{
                            pathname: '/vysledek',
                            state: {
                                totalRoundScore,
                                guessedPoints,
                            },
                        }}
                    >
                        Vyhodnotit hru
                    </Link>
                </Button>
            );
        }
        return (
            <>
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
                {nextRoundButtonVisible ? (
                    <Button onClick={() => refreshMap()} type="primary">
                        Další kolo
                    </Button>
                ) : null}
            </>
        );
    };

    const calculateCoords = () => {
        const markerPanoramaOptions = {
            url: DEFAUL_MARKER_PLACE_ICON,
            anchor: { left: 10, bottom: 15 },
        };
        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);
        setRoundGuessed(true);

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
            'Panorama point',
            markerPanoramaOptions,
        );
        refLayerValue.current.addMarker(markerPanorama);
        updateCalculation({ pointPanorama, pointMap });
    };

    return (
        <>
            {!roundGuessed ? (
                <RoundSMapWrapper
                    onMapClick={clickMapPoint}
                    refLayeredMapValue={refLayeredMapValue}
                    refLayerValue={refLayerValue}
                    refVectorLayerSMapValue={refVectorLayerSMapValue}
                />
            ) : (
                <ResultSMapWrapper guessedPoints={[guessedPoints[guessedPoints.length - 1]]} />
            )}
            {getMapButton()}
        </>
    );
};

export default GuessingMap;
