import { Divider } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';

import MapyCzContext from '../../context/MapyCzContext';
import useSMapResize from '../../hooks/useSMapResize';
import { mapLayers } from '../../redux/reducers/game';
import {
    drawAllResultsLayerToMap,
    getMapInstanceByGameMode,
    setupLayerWithMarksAndDataProvider,
    setupMapInstance,
} from '../../util/map';

const ResultSMap = ({ guessedPoints, mode, city, radius }) => {
    const { width } = useSMapResize();
    const resultMap = useRef();
    const mapyContext = useContext(MapyCzContext);
    const [layerWithMarksRef, setLayerWithMarksRef] = useState();
    const [vectorLayerRef, setVectorLayerRef] = useState();
    const [mapInstanceRef, setMapInstanceRef] = useState();

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            const { SMap: SMapContext } = mapyContext;
            const mapInstance = getMapInstanceByGameMode(SMapContext, mode, city, radius, resultMap.current);
            setupMapInstance(SMapContext, mapInstance, mapLayers.default);

            // vrstva se značkami
            const layerWithMarks = setupLayerWithMarksAndDataProvider(SMapContext, mapInstance);

            const vectorLayer = new SMapContext.Layer.Geometry();
            mapInstance.addLayer(vectorLayer);
            vectorLayer.enable();

            setVectorLayerRef(vectorLayer);
            setLayerWithMarksRef(layerWithMarks);
            setMapInstanceRef(mapInstance);
        }
    }, [mapyContext, city, mode, radius]);

    useEffect(() => {
        if (mapyContext.loadedMapApi && mapInstanceRef && layerWithMarksRef && vectorLayerRef) {
            layerWithMarksRef.removeAll();
            vectorLayerRef.removeAll();
            drawAllResultsLayerToMap(
                mapyContext.SMap,
                mapInstanceRef,
                layerWithMarksRef,
                vectorLayerRef,
                guessedPoints,
            );
        }
    }, [mapyContext.loadedMapApi, mapyContext.SMap, guessedPoints, mapInstanceRef, layerWithMarksRef, vectorLayerRef]);

    return (
        <div id="smap-container">
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className="smap-result smap-style" ref={resultMap} />
        </div>
    );
};

export default ResultSMap;
