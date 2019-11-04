import React, {useState, useEffect, useContext} from 'react';
import MapyContext from '../../context/MapyContext'

const GuessingMap = () => {
    const [guessingMap, setGuessingMap] = useState(React.createRef());
    const mapyContext = useContext(MapyContext)
    const [loadedMap, setLoadedMap] = useState(false);

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
            }

            m.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */
        }
    }, [mapyContext, loadedMap, guessingMap]);

    return (
        <div>
            <h1>Guessing map</h1>
            <div id="m"></div>
        </div>
    );
};

export default GuessingMap;
