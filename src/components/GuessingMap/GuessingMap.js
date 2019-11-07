import React, {useState, useContext} from 'react';
import {useLocation, Redirect} from 'react-router-dom';
import MapyContext from '../../context/MapyContext'
import NextRoundButton from "../NextRoundButton";
import {DEFAUL_MARKER_PLACE_ICON, roundToTwoDecimal} from '../../util/Util';
import RoundSMapWrapper from "../SMap/RoundSMapWrapper";

const TIMER = 10;
const MIN_DISTANCE_FOR_POINTS = 350;
const MAX_SCORE = 5000;
const TOTAL_ROUNDS_MAX = 3;

const GuessingMap = ({ calculateDistance, loadPanoramaMap, generateRandomCzechPlace }) => {
    const location = useLocation();
    const mapyContext = useContext(MapyContext)
    const [layeredMap] = useState(null);
    const [layer] = useState(null);
    const [vectorLayerSMap] = useState(null);
    const [timer, setTimer] = useState(TIMER);
    const [guessedDistance, setGuessedDistance] = useState(null);
    const [guessedPlace, setGuessedPlace] = useState(null);
    const [roundScore, setRoundScore] = useState(0);
    const [totalRoundScore, setTotalRoundScore] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [roundCompleted, setRoundCompleted] = useState(false);
    const [guessedPoints, setGuessedPoints] = useState([]);

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
        let { radius } = location.state;
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
        const options = {
            anchor: {left:10, bottom: 1}  /* Ukotvení značky za bod uprostřed dole */
        };
        // state is not working in event handling
        //if (guessButtonDisabled && refLayerValue.current && !nextRoundButtonVisible) {
        refLayerValue.current.removeAll();
        const coords = mapyContext.SMap.Coords.fromEvent(e.data.event, refLayeredMapValue.current);
        // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
        const marker = new mapyContext.SMap.Marker(mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y), "Můj odhad", options);
        refLayerValue.current.addMarker(marker);
        setCoordinates({
            mapLat: coords.y,
            mapLon: coords.x,
        });
        setGuessButtonDisabled(false);
        // }
    };

    /*
    useEffect(() => {
        setTimeout(() => {
            if (timer > 0) {
                setTimer((currentTimer) => currentTimer - 1);
            }
        }, 1000);
    }, [timer]);
     */

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

    const resolveRounds = () => {
        setRoundCompleted(true);
    }

    const renderGuessingMapButtons = () => {
        if (roundCompleted) {
            return (
                <Redirect
                    to={{
                        pathname: '/result',
                        state: {
                            totalRoundScore,
                            guessedPoints,
                        }
                    }}
                />
            )
        } else if (totalRounds >= TOTAL_ROUNDS_MAX) {
            return (
                <button onClick={() => {
                    resolveRounds()
                }} type="submit">
                    Vyhodnotit kolo
                </button>
            )
        } else {
            return (
                <div>
                    {
                        !nextRoundButtonVisible ?
                            <button disabled={guessButtonDisabled} onClick={() => {
                                calculateCoords(calculateDistance)
                            }} type="submit">
                                Hádej!
                            </button> : null
                    }
                    {
                        nextRoundButtonVisible ?
                            <NextRoundButton refreshMap={() => refreshMap()}/> : null
                    }
                </div>
            )
        }
    }

    const calculateCoords = (calculateDistance) => {
        const markerPanoramaOptions = {
            url: DEFAUL_MARKER_PLACE_ICON,
            anchor: {left:10, bottom: 15}
        };

        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);
        const coordsAndDistance = calculateDistance(coordinates);

        const pointPanorama = mapyContext.SMap.Coords.fromWGS84(coordsAndDistance.panoramaCoordinates.lon, coordsAndDistance.panoramaCoordinates.lat);
        const pointMap = mapyContext.SMap.Coords.fromWGS84(coordinates.mapLon, coordinates.mapLat);

        const points1 = [
            pointPanorama,
            pointMap,
        ];

        const options1 = {
            color: "#f00",
            width: 3
        };

        console.log("POOOOINTS: ", points1)

        const path = new mapyContext.SMap.Geometry(mapyContext.SMap.GEOMETRY_POLYLINE, null, points1, options1);
        refVectorLayerSMapValue.current.addGeometry(path);

        // panorama place marker
        const markerPanorama = new mapyContext.SMap.Marker(mapyContext.SMap.Coords.fromWGS84(coordsAndDistance.panoramaCoordinates.lon, coordsAndDistance.panoramaCoordinates.lat), `Panorama point`, markerPanoramaOptions);
        refLayerValue.current.addMarker(markerPanorama);

        const score = calculateScore(coordsAndDistance.distance);

        setGuessedPoints([...guessedPoints, {
            pointPanorama,
            pointMap,
        }]);
        setRoundScore(score);
        setGuessedDistance(coordsAndDistance.distance);
        setTotalRoundScore((prevScore) => prevScore + score);
        setTotalRounds((prevRoundCount) => prevRoundCount + 1);

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
                totalRounds > 0 ?
                    <p>Kolo: {totalRounds}/{TOTAL_ROUNDS_MAX}</p> : null
            }
            {
                totalRoundScore ?
                    <p>Celkové skóre: {totalRoundScore}</p> : null
            }
            {
                guessedDistance ?
                    <p>Vzdušná vzdálenost místa od tvého odhadu: {roundToTwoDecimal(guessedDistance)} km</p> : null
            }
            {
                guessedDistance ?
                    <p>Skóre: {roundScore}</p> : null
            }
            {
                (guessedPlace && guessedDistance) ?
                    <>
                        <p>Obec: {guessedPlace.obec}</p>
                        <p>Okres: {guessedPlace.okres}</p>
                        <p>Kraj: {guessedPlace.kraj}</p>
                    </> : null
            }
            <RoundSMapWrapper click={click} refLayeredMapValue={refLayeredMapValue} refLayerValue={refLayerValue}
                              refVectorLayerSMapValue={refVectorLayerSMapValue}/>
            {renderGuessingMapButtons()}
        </div>
    );
};

export default GuessingMap;
