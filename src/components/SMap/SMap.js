import React, {useContext, useEffect, useState} from 'react';
import MapyContext from "../../context/MapyContext";

const SMap = (props) => {

    const [resultObtained, setResultObrained] = useState(false);
    const mapyContext = useContext(MapyContext)

    const initSMap = () => {
        const SMap = mapyContext.SMap;
        const JAK = mapyContext.JAK;

        if (SMap && JAK) {
            const center = SMap.Coords.fromWGS84(14.400307, 50.071853);
            const m = new SMap(JAK.gel("m"), center, 7);
            // var m = new RoundSMapWrapper(guessingMap.current, RoundSMapWrapper.Coords.fromWGS84(14.400307, 50.071853));
            m.addDefaultControls();
            m.addControl(new SMap.Control.Sync()); /* Aby mapa reagovala na změnu velikosti průhledu */
            m.addDefaultLayer(SMap.DEF_BASE).enable();

            const mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM); /* Ovládání myší */
            m.addControl(mouse);

            // 8. vrstva se značkami
            const layerSMap = new SMap.Layer.Marker();
            m.addLayer(layerSMap);
            layerSMap.enable();

            if (props.type && props.type === 'result') {
                const { guessedPoints } = props;
                console.log("PROPS: ", props)
                const options = {
                    color: "#f00",
                    width: 3
                };
                console.log("------------ 1")
                const vectorLayer = new mapyContext.SMap.Layer.Geometry();
                m.addLayer(vectorLayer);
                console.log("------------ 2")
                vectorLayer.enable();
                console.log("------------ 3")
                console.log("******************")
                for (let i = 0; i < guessedPoints.length; i++) {
                    console.log("****************** 1 ")
                    const pointsObject = guessedPoints[i];
                    const pointsVectorArray = [
                        pointsObject.pointMap,
                        pointsObject.pointPanorama,
                    ];
                    console.log("NOOOOOOOO pointsVectorArray: ", pointsVectorArray)
                    const path = new mapyContext.SMap.Geometry(mapyContext.SMap.GEOMETRY_POLYLINE, null, pointsVectorArray, options);
                    vectorLayer.addGeometry(path);
                    setResultObrained(true);
                }
            } else if (props.type === 'round') {
                const { click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue } = props;
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
            } else {
                // TODO throw something?
            }
        }
    };

    useEffect(() => {
        console.log("RESULT OBTAINED: ", resultObtained)
        if (mapyContext.loadedMapApi && !resultObtained) {
            initSMap();
        }
    }, [mapyContext.loadedMapApi, resultObtained]);

    return <div id="m"></div>
};

export default SMap;
