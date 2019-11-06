import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import NextRoundButton from "../NextRoundButton";

const GuessingMap = ({calculateDistance}) => {
    const mapyContext = useContext(MapyContext)
    const [layeredMap] = useState(null);
    const [layer] = useState(null);
    let refLayerValue = React.useRef(layer);
    let refLayeredMapValue = React.useRef(layeredMap);

    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    const [coordinates, setCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    const click = (e, elm) => { // Došlo ke kliknutí, spočítáme kde
        var options = {};
        if (guessButtonDisabled && refLayerValue.current) {
            refLayerValue.current.removeAll();
            var coords = mapyContext.SMap.Coords.fromEvent(e.data.event, refLayeredMapValue.current);
            // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
            var marker = new mapyContext.SMap.Marker(mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y), "myMarker", options);
            refLayerValue.current.addMarker(marker);
            setCoordinates({
                mapLat: coords.y,
                mapLon: coords.x,
            })
            setGuessButtonDisabled(false);
        }
    }

    const initSMap = () => {
        const SMap = mapyContext.SMap;
        const JAK = mapyContext.JAK;

        if (SMap && JAK) {
            const center = SMap.Coords.fromWGS84(14.400307, 50.071853);
            var m = new SMap(JAK.gel("m"), center, 7);
            // var m = new SMap(guessingMap.current, SMap.Coords.fromWGS84(14.400307, 50.071853));
            m.addDefaultControls();
            m.addControl(new SMap.Control.Sync()); /* Aby mapa reagovala na změnu velikosti průhledu */
            m.addDefaultLayer(SMap.DEF_BASE).enable();

            var mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM); /* Ovládání myší */
            m.addControl(mouse);

            // 8. vrstva se značkami
            var layerSMap = new SMap.Layer.Marker();
            m.addLayer(layerSMap);
            layerSMap.enable();
            refLayerValue.current = layerSMap;
            m.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */
            // m.getSignals().addListener(window, "map-click", () => { setGuessButtonDisabled(false)}); /* Při signálu kliknutí volat tuto funkci */
            refLayeredMapValue.current = m;
        }
    };

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            initSMap();
        }
    }, [mapyContext.loadedMapApi]);

    const refreshMap = () => {
        console.log("************************ REFRESH MAP!!!!!! ***************************")
    }

    const calculateCoords = (calculateDistance) => {
        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);
        const coordsAndDistance = calculateDistance(coordinates);
        // vykreslit vektor do mapy
        const vectorLayer = new mapyContext.SMap.Layer.Geometry();
        refLayeredMapValue.current.addLayer(vectorLayer);
        vectorLayer.enable();

        var points1 = [
            mapyContext.SMap.Coords.fromWGS84(coordsAndDistance.panoramaCoordinates.lon, coordsAndDistance.panoramaCoordinates.lat),
            mapyContext.SMap.Coords.fromWGS84(coordinates.mapLon, coordinates.mapLat)
        ];

        var options1 = {
            color: "#f00",
            width: 3
        };

        var path = new mapyContext.SMap.Geometry(mapyContext.SMap.GEOMETRY_POLYLINE, null, points1, options1);
        vectorLayer.addGeometry(path);
    }

    return (
        <div>
            <h1>Guessing map</h1>
            <div id="m"></div>
            <button disabled={guessButtonDisabled} onClick={() => { calculateCoords(calculateDistance)}} type="submit" value="Hááádej">
                Hádej!
            </button>
            { nextRoundButtonVisible ? <NextRoundButton  refreshMap={() => refreshMap()}/> : null }
        </div>
    );
};

export default GuessingMap;
