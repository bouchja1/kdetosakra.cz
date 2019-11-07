import React, {useContext, useEffect, useState} from 'react';
import MapyContext from "../../context/MapyContext";

const SMap = (props) => {
    const [map] = useState(React.createRef());
    const mapyContext = useContext(MapyContext)
    const { closeResultPage } = props;

    const initSMap = () => {
        const SMap = mapyContext.SMap;
        const JAK = mapyContext.JAK;

        if (SMap && JAK) {
            const center = SMap.Coords.fromWGS84(14.400307, 50.071853);
            const m = new SMap(map.current, center, 7);
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
                const options = {
                    color: "#f00",
                    width: 3
                };
                const vectorLayer = new mapyContext.SMap.Layer.Geometry();
                m.addLayer(vectorLayer);
                vectorLayer.enable();
                console.log("VECTOR LAYER GEOMETRIES: ", vectorLayer.getGeometries())
                for (let i = 0; i < guessedPoints.length; i++) {
                    const pointsObject = guessedPoints[i];
                    const pointPanorama = mapyContext.SMap.Coords.fromWGS84(pointsObject.pointPanorama.x, pointsObject.pointPanorama.y);
                    const pointMap = mapyContext.SMap.Coords.fromWGS84(pointsObject.pointMap.x, pointsObject.pointMap.y);
                    const pointsVectorArray = [
                        pointPanorama,
                        pointMap,
                    ];

                    console.log("NOOOOOOO: ", pointsVectorArray)

                    const path = new mapyContext.SMap.Geometry(mapyContext.SMap.GEOMETRY_POLYLINE, null, pointsVectorArray, options);
                    console.log("PAAAAATH: ", path)
                    vectorLayer.addGeometry(path);
                    console.log("VECTOR LAYER GEOMETRIES AFTER: ", vectorLayer.getGeometries())
                }
            } else if (props.type === 'round') {
                const { click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue } = props;
                // assign vrstva se značkami
                refLayerValue.current = layerSMap;
                // assing layered map value
                refLayeredMapValue.current = m;
                refLayeredMapValue.current.getSignals().addListener(window, "map-click", click); /* Při signálu kliknutí volat tuto funkci */

                // vykreslit vektor do mapy
                const vectorLayer = new mapyContext.SMap.Layer.Geometry();
                refLayeredMapValue.current.addLayer(vectorLayer);
                vectorLayer.enable();
                refVectorLayerSMapValue.current = vectorLayer;
            }
        }
    };

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            initSMap();
        }
    }, [mapyContext.loadedMapApi]);

    return (
        <>
        <div id="smapView" ref={map}></div>
            {
                props.type === 'result' ?
                    <button onClick={() => {
                        closeResultPage()
                    }} type="submit">
                        Hrát znovu
                    </button> : null
            }
        </>
    )
};

export default SMap;
