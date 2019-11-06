import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'
import NextRoundButton from "../NextRoundButton";

const GuessingMap = ({panoramaCoordinates}) => {
    const mapyContext = useContext(MapyContext)
    const [layeredMap, setLayeredMap] = useState(null);
    const [layer, setLayer] = useState(null);
    const [guessButtonDisabled, setGuessButtonDisabled] = useState(true);
    const [nextRoundButtonVisible, setNextRoundButtonVisible] = useState(false);
    const [coordinates, setCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    const click = (e, elm) => { // Došlo ke kliknutí, spočítáme kde
        var options = {};
        console.log("Guess button disabled: ", guessButtonDisabled)
        console.log("Layer: ", layer)
        if (guessButtonDisabled && layer) {
            console.log("*****************-------------------")
            layer.removeAll();
            var coords = mapyContext.SMap.Coords.fromEvent(e.data.event, layeredMap);
            // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
            var marker = new mapyContext.SMap.Marker(mapyContext.SMap.Coords.fromWGS84(coords.x, coords.y), "myMarker", options);
            layer.addMarker(marker);
            console.log("MARKER LON: ", coords.x)
            console.log("MARKER LAT: ", coords.y)
            console.log("COOOORDINATES: ", coordinates)
            setCoordinates({
                mapLat: coords.y,
                mapLon: coords.x,
            })
            console.log("################################### WILL SET GUESS BUTTON DISABLED")
        }
    }

    const initSMap = () => {
        const SMap = mapyContext.SMap;
        const JAK = mapyContext.JAK;

        if (SMap && JAK) {
            const center = SMap.Coords.fromWGS84(14.400307, 50.071853);
            var m = new SMap(JAK.gel("m"), center, 7);
            console.log("M: ", m)
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
            setLayer(layerSMap)
            console.log("AAAAA*************&&&&&&&&&&&: ", layer)

            m.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */
            // m.getSignals().addListener(window, "map-click", () => { setGuessButtonDisabled(false)}); /* Při signálu kliknutí volat tuto funkci */
            setLayeredMap(m);
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

    const calculateCoords = () => {
        setGuessButtonDisabled(true);
        setNextRoundButtonVisible(true);
        console.log("PANORAMA COOORDS: ", panoramaCoordinates)
        console.log("MAP COOORDS: ", coordinates)

        let distance;
        if ((panoramaCoordinates.panoramaLat === coordinates.mapLat) && (panoramaCoordinates.panoramaLon === coordinates.mapLon)) {
            distance = 0;
        }
        else {
            const radlat1 = Math.PI * panoramaCoordinates.panoramaLat / 180;
            const radlat2 = Math.PI * coordinates.mapLat / 180;
            const theta = panoramaCoordinates.panoramaLon - coordinates.mapLon;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344; // convert to kilometers
            distance = dist;
        }

        const SMap = window.SMap;
        // TODO vykreslit vektor do mapy
        var layer = new SMap.Layer.Geometry();
        layeredMap.addLayer(layer);
        layer.enable();

        var points1 = [
            SMap.Coords.fromWGS84(panoramaCoordinates.panoramaLon, panoramaCoordinates.panoramaLat),
            SMap.Coords.fromWGS84(coordinates.mapLon, coordinates.mapLat)
        ];

        var options1 = {
            color: "#f00",
            width: 3
        };

        var path = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, points1, options1);
        layer.addGeometry(path);

        console.log("****************** DISTANCE: ", distance)

    }

    return (
        <div>
            <h1>Guessing map</h1>
            <div id="m"></div>
            <button disabled={guessButtonDisabled} onClick={() => { calculateCoords()}} type="submit" value="Hááádej">
                Hádej!
            </button>
            { nextRoundButtonVisible ? <NextRoundButton  refreshMap={() => refreshMap()}/> : null }
        </div>
    );
};

export default GuessingMap;
