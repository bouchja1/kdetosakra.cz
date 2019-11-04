import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'

const GuessingMap = ({panoramaCoordinates}) => {
    const [guessingMap, setGuessingMap] = useState(React.createRef());
    const mapyContext = useContext(MapyContext)
    const [loadedMap, setLoadedMap] = useState(false);
    const [coordinates, setCoordinates] = useState({
        mapLon: 0,
        mapLat: 0,
    });

    useEffect(() => {
        if (mapyContext && !loadedMap) {
            const SMap = window.SMap;
            const JAK = window.JAK;

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
            var layer = new SMap.Layer.Marker();
            m.addLayer(layer);
            layer.enable();
            var options = {};

            function click(e, elm) { /* Došlo ke kliknutí, spočítáme kde */
                layer.removeAll();
                var coords = SMap.Coords.fromEvent(e.data.event, m);
                // alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
                var marker = new SMap.Marker(SMap.Coords.fromWGS84(coords.x, coords.y), "myMarker", options);
                layer.addMarker(marker);
                console.log("MARKER LON: ", coords.x)
                console.log("MARKER LAT: ", coords.y)
                console.log("COOOORDINATES: ", coordinates)
                setCoordinates({
                    mapLat: coords.y,
                    mapLon: coords.x,
                })
            }

            m.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */
        }
    }, [mapyContext, loadedMap, guessingMap]);

    const calculateCoords = () => {
        console.log("PANORAMA COOORDS: ", panoramaCoordinates)
        console.log("MAP COOORDS: ", coordinates)

        let distance;
        if ((panoramaCoordinates.panoramaLat == coordinates.mapLat) && (panoramaCoordinates.panoramaLon == coordinates.mapLon)) {
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

        console.log("****************** DISTANCE: ", distance)

    }

    return (
        <div>
            <h1>Guessing map</h1>
            <div id="m"></div>
            <button onClick={() => { calculateCoords()}} type="submit" value="Hááádej"/>
        </div>
    );
};

export default GuessingMap;
