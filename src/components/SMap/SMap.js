import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';
import MapyCzContext from '../../context/MapyCzContext';
import useSMapResize from '../../hooks/useSMapResize';
import { getMapInstanceByGameMode, setupMapInstanceAndLayers, drawSingleRoundResultLayerToMap } from '../../util/map';

const SMap = ({
    guessedPoints,
    type,
    onMapClick,
    refLayeredMapValue,
    refLayerValue,
    refVectorLayerSMapValue,
    isBattle,
}) => {
    const { width } = useSMapResize();
    const map = useRef();
    const mapyContext = useContext(MapyCzContext);
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const initSMap = mapInstance => {
        setupMapInstanceAndLayers(mapyContext.SMap, mapInstance);

        // vrstva se značkami
        const layerWithMarks = new mapyContext.SMap.Layer.Marker();
        mapInstance.addLayer(layerWithMarks);
        layerWithMarks.enable();

        if (type === 'result') {
            drawSingleRoundResultLayerToMap(mapyContext.SMap, mapInstance, layerWithMarks, guessedPoints[0]);
        } else {
            // assign vrstva se značkami
            refLayerValue.current = layerWithMarks;
            // assing layered map value
            refLayeredMapValue.current = mapInstance;
            refLayeredMapValue.current
                .getSignals()
                .addListener(window, 'map-click', onMapClick); /* Při signálu kliknutí volat tuto funkci */

            // vykreslit vektor do mapy
            const vectorLayer = new mapyContext.SMap.Layer.Geometry();
            refLayeredMapValue.current.addLayer(vectorLayer);
            vectorLayer.enable();
            refVectorLayerSMapValue.current = vectorLayer;
        }
    };

    useEffect(() => {
        if (isBattle && mapyContext.loadedMapApi) {
            const {
                mode: battleMode, radius: battleRadius, rounds, round,
            } = currentBattleInfo;
            if (battleMode && round && rounds) {
                const mapInstance = getMapInstanceByGameMode(
                    mapyContext.SMap,
                    battleMode,
                    rounds[round - 1].city,
                    battleRadius,
                    map.current,
                );
                initSMap(mapInstance);
            }
        } else if (mapyContext.loadedMapApi) {
            const { mode, city, radius } = currentGame;
            const mapInstance = getMapInstanceByGameMode(mapyContext.SMap, mode, city, radius, map.current);
            initSMap(mapInstance);
        }
    }, [mapyContext.loadedMapApi, isBattle, currentBattleInfo, currentGame]);

    return (
        <>
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className="smap smap-style" ref={map} />
        </>
    );
};

export default SMap;
