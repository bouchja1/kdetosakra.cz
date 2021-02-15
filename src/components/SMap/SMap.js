import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';
import MapyCzContext from '../../context/MapyCzContext';
import useSMapResize from '../../hooks/useSMapResize';
import {
    getMapInstanceByGameMode,
    setupMapInstance,
    drawSingleRoundResultLayerToMap,
    setupLayerWithMarksAndDataProvider,
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
    const { width } = useSMapResize();
    const map = useRef();
    const mapyContext = useContext(MapyCzContext);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [instance, setInstance] = useState();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const {
        mode: battleMode, radius: battleRadius, rounds, round,
    } = currentBattleInfo;
    const { mode, city, radius } = currentGame;

    const isMapMetaInfoLoaded = isBattle ? battleMode && round && rounds : mode && radius;

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
            setupMapInstance(SMapContext, mapInstance);

            // vrstva se značkami
            const layerWithMarks = setupLayerWithMarksAndDataProvider(SMapContext, mapInstance);

            if (type === 'result') {
                drawSingleRoundResultLayerToMap(SMapContext, mapInstance, layerWithMarks, currentRoundGuessedPoint);
            } else {
                // assign vrstva se značkami
                refLayerValue.current = layerWithMarks;
                // assing layered map value
                refLayeredMapValue.current = mapInstance;
                refLayeredMapValue.current
                    .getSignals()
                    .addListener(window, 'map-click', onMapClick); /* Při signálu kliknutí volat tuto funkci */

                // vykreslit vektor do mapy
                const vectorLayer = new SMapContext.Layer.Geometry();
                refLayeredMapValue.current.addLayer(vectorLayer);
                vectorLayer.enable();
                refVectorLayerSMapValue.current = vectorLayer;
            }
            setInstance(mapInstance);
            setMapLoaded(true);
        }
    }, [mapyContext.loadedMapApi, mapLoaded, isMapMetaInfoLoaded, round]);

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
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className="smap smap-style" ref={map} />
        </>
    );
};

export default SMap;
