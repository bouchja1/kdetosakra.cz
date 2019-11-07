import React, {useState, useEffect, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import MapyContext from '../../context/MapyContext'
import NextRoundButton from "../NextRoundButton";
import {roundToTwoDecimal} from '../../util/Util';

const TIMER = 10;
const MIN_DISTANCE_FOR_POINTS = 350;
const MAX_SCORE = 5000;

const GuessingMap = ({ calculateDistance, loadPanoramaMap, generateRandomCzechPlace }) => {
    const location = useLocation();
    const mapyContext = useContext(MapyContext)
    const [layeredMap] = useState(null);
    const [layer] = useState(null);
    const [vectorLayerSMap] = useState(null);
    const [timer, setTimer] = useState(TIMER);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    let refLayerValue = React.useRef(layer);
    let refVectorLayerSMapValue = React.useRef(vectorLayerSMap);
    let refLayeredMapValue = React.useRef(layeredMap);

    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    const [coordinates, setCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    const calculateScore = (distance) => {
        if (distance < 1)
            return 5000;
        let score = (MIN_DISTANCE_FOR_POINTS - distance) / (MIN_DISTANCE_FOR_POINTS / MAX_SCORE);
        if (score < 0)
            return 0;
        score = score ** 2 / MAX_SCORE;
        score = Math.max(0, score);
        score = Math.min(MAX_SCORE, score);
        return Math.round(score);
    };

    const click = (e, elm) => { // Došlo ke kliknutí, spočítáme kde
        const options = {};
        if (guessButtonDisabled && refLayerValue.current) {
            refLayerValue.current.removeAll();
            const coords = mapyContext.SMap.Coords.fromEvent(e.data.event, refLayeredMapValue.current);
            // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
            const marker = new mapyContext.SMap.Marker(mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y), "myMarker", options);
            refLayerValue.current.addMarker(marker);
            setCoordinates({
                mapLat: coords.y,
                mapLon: coords.x,
            });
            setGuessButtonDisabled(false);
        }
    };

    const initSMap = () => {
        const SMap = mapyContext.SMap;
        const JAK = mapyContext.JAK;

        if (SMap && JAK) {
            const center = SMap.Coords.fromWGS84(14.400307, 50.071853);
            const m = new SMap(JAK.gel("m"), center, 7);
            // var m = new SMap(guessingMap.current, SMap.Coords.fromWGS84(14.400307, 50.071853));
            m.addDefaultControls();
            m.addControl(new SMap.Control.Sync()); /* Aby mapa reagovala na změnu velikosti průhledu */
            m.addDefaultLayer(SMap.DEF_BASE).enable();

            const mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM); /* Ovládání myší */
            m.addControl(mouse);

            // 8. vrstva se značkami
            const layerSMap = new SMap.Layer.Marker();
            m.addLayer(layerSMap);
            layerSMap.enable();
            // assign vrstva se značkami
            refLayerValue.current = layerSMap;
            m.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */

            // assing layered map value
            refLayeredMapValue.current = m;

            // vykreslit vektor do mapy
            const vectorLayer = new mapyContext.SMap.Layer.Geometry();
            refLayeredMapValue.current.addLayer(vectorLayer);
            vectorLayer.enable();
            refVectorLayerSMapValue.current = vectorLayer;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (timer > 0) {
                setTimer((currentTimer) => currentTimer - 1);
            }
        }, 1000);
    }, [timer]);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            initSMap();
        }
    }, [mapyContext.loadedMapApi]);

    const refreshMap = () => {
        let { radius, city, mode } = location.state;
        refLayerValue.current.removeAll();
        refVectorLayerSMapValue.current.removeAll();
        setNextRoundButtonVisible(false);
        setGuessButtonDisabled(true);
        setGuessedDistance(null);
        setGuessedPlace(null);
        setTimer(TIMER);
        if (mode === 'random') {
            city = generateRandomCzechPlace();
        }
        loadPanoramaMap(radius, city, true);
    }

    const showTimer = () => {
        /*
        if (timer > 0) {
            return <h2>{timer}</h2>;
        } else if (timer < 1) {
            // calculateCoords(calculateDistance);
            return <h2>Došel ti čas</h2>
        }
         */
    }

    const calculateCoords = (calculateDistance) => {
        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);
        const coordsAndDistance = calculateDistance(coordinates);

        const points1 = [
            mapyContext.SMap.Coords.fromWGS84(coordsAndDistance.panoramaCoordinates.lon, coordsAndDistance.panoramaCoordinates.lat),
            mapyContext.SMap.Coords.fromWGS84(coordinates.mapLon, coordinates.mapLat)
        ];

        const options1 = {
            color: "#f00",
            width: 3
        };

        const path = new mapyContext.SMap.Geometry(mapyContext.SMap.GEOMETRY_POLYLINE, null, points1, options1);
        refVectorLayerSMapValue.current.addGeometry(path);
        setGuessedDistance(coordsAndDistance.distance);
        if (coordsAndDistance.hasOwnProperty('randomCity')) {
            setGuessedPlace({
                obec: coordsAndDistance.randomCity.obec,
                okres: coordsAndDistance.randomCity.okres,
                kraj: coordsAndDistance.randomCity.kraj,
            })
        }
    };

    return (
        <div>
            <h1>Guessing map</h1>
            {showTimer()}
            {
                guessedDistance ?
                    <p>Vzdušná vzdálenost místa od tvého odhadu: {roundToTwoDecimal(guessedDistance)} km</p> : null
            }
            {
                guessedDistance ?
                    <p>Skóre: {calculateScore(guessedDistance)}</p> : null
            }
            {
                (guessedPlace && guessedDistance) ?
                <div>
                <p>Obec: {guessedPlace.obec}</p>
                <p>Okres: {guessedPlace.okres}</p>
                <p>Kraj: {guessedPlace.kraj}</p>
                </div> : null
            }
            {}
            <div id="m"></div>
            <button disabled={guessButtonDisabled} onClick={() => {
                calculateCoords(calculateDistance)
            }} type="submit">
                Hádej!
            </button>
            {nextRoundButtonVisible ? <NextRoundButton refreshMap={() => refreshMap()}/> : null}
        </div>
    );
};

export default GuessingMap;
