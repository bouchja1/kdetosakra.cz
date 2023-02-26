import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MapyCzContext from '../../context/MapyCzContext';
import { setCurrentMapLayer } from '../../redux/actions/game';
import { mapLayers } from '../../redux/reducers/game';
import {
    drawSingleRoundResultLayerToMap,
    getMapInstanceByGameMode,
    setupLayerWithMarksAndDataProvider,
    setupMapInstance,
} from '../../util/map';

const SMap = ({
    currentRoundGuessedPoint,
    type,
    onMapClick,
    refLayeredMapValue,
    refLayerValue,
    refVectorLayerSMapValue,
    isBattle,
}) => {
    const map = useRef();
    const dispatch = useDispatch();
    const mapyContext = useContext(MapyCzContext);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [instance, setInstance] = useState();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const { mode: battleMode, radius: battleRadius, rounds, round } = currentBattleInfo;
    const { mode, city, radius, currentMapLayer } = currentGame;

    const isMapMetaInfoLoaded = isBattle ? battleMode && round && rounds : mode && radius;

    const changeMapLayerListener = event => {
        if (event.target.constructor.NAME === 'SMap.Layer.Turist') {
            dispatch(setCurrentMapLayer(mapLayers.tourist));
        } else {
            dispatch(setCurrentMapLayer(mapLayers.default));
        }
    };

    useEffect(() => {
        if (mapyContext.loadedMapApi && mapyContext.SMap && !mapLoaded && isMapMetaInfoLoaded) {
            const { SMap: SMapContext } = mapyContext;
            const mapInstanceInitObject = isBattle
                ? { mapMode: battleMode, mapCity: rounds[round - 1].city, mapRadius: battleRadius }
                : { mapMode: mode, mapCity: city, mapRadius: radius };

            const mapInstance = getMapInstanceByGameMode(
                SMapContext,
                mapInstanceInitObject.mapMode,
                mapInstanceInitObject.mapCity,
                mapInstanceInitObject.mapRadius,
                map.current,
            );
            setupMapInstance(SMapContext, mapInstance, currentMapLayer);

            // vrstva se značkami
            const layerWithMarks = setupLayerWithMarksAndDataProvider(SMapContext, mapInstance);

            if (type === 'result') {
                drawSingleRoundResultLayerToMap(SMapContext, mapInstance, layerWithMarks, currentRoundGuessedPoint);
            } else {
                // assign vrstva se značkami
                refLayerValue.current = layerWithMarks;
                // assing layered map value
                refLayeredMapValue.current = mapInstance;
                const signals = refLayeredMapValue.current.getSignals();

                signals.addListener(window, 'map-click', onMapClick); /* Při signálu kliknutí volat tuto funkci */

                // vykreslit vektor do mapy
                const vectorLayer = new SMapContext.Layer.Geometry();
                refLayeredMapValue.current.addLayer(vectorLayer);
                vectorLayer.enable();
                refVectorLayerSMapValue.current = vectorLayer;

                signals.addListener(window, 'layer-enable', changeMapLayerListener);
            }
            setInstance(mapInstance);
            setMapLoaded(true);
        }
    }, [mapyContext.loadedMapApi, mapLoaded, isMapMetaInfoLoaded, round, currentMapLayer]);

    // special case for battle when the page is reloaded and we want to load previous tip
    // FIXME: is this even used?
    useEffect(() => {
        if (isBattle && mapyContext.loadedMapApi && mapyContext.SMap && instance) {
            const { SMap: SMapContext } = mapyContext;
            // vrstva se značkami
            const layerWithMarks = setupLayerWithMarksAndDataProvider(SMapContext, instance);

            const currentRound = rounds[round - 1];
            const { isGuessed, isRoundActive } = currentRound;

            if (isGuessed && !isRoundActive && currentRoundGuessedPoint) {
                drawSingleRoundResultLayerToMap(SMapContext, instance, layerWithMarks, currentRoundGuessedPoint);
            }
        }
    }, [mapyContext.loadedMapApi, instance, currentRoundGuessedPoint]);

    return (
        <>
            <div id="smap" className="smap smap-style" ref={map} />
        </>
    );
};

export default SMap;
