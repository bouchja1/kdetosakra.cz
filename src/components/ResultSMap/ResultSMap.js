import { Divider, Spin } from 'antd';
import React, {
    useContext, useRef, useEffect, useState
} from 'react';
import { useSelector } from 'react-redux';
import useSMapResize from '../../hooks/useSMapResize';
import MapyCzContext from '../../context/MapyCzContext';
import {
    getMapInstanceByGameMode,
    setupMapInstance,
    drawAllResultsLayerToMap,
    setupLayerWithMarksAndDataProvider,
} from '../../util/map';

const ResultSMap = ({
    guessedPoints, isBattle, mode, city, radius,
}) => {
    const { width } = useSMapResize();
    const resultMap = useRef();
    const mapyContext = useContext(MapyCzContext);
    const [mapLoaded, setMapLoaded] = useState(false);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const {
        mode: battleMode, radius: battleRadius, rounds, round,
    } = currentBattleInfo;

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
                resultMap.current,
            );
            setupMapInstance(SMapContext, mapInstance);
            const layerWithMarks = setupLayerWithMarksAndDataProvider(SMapContext, mapInstance);
            drawAllResultsLayerToMap(mapyContext.SMap, mapInstance, layerWithMarks, guessedPoints);
            setMapLoaded(true);
        }
    }, [mapyContext.loadedMapApi, mapLoaded, isMapMetaInfoLoaded]);

    return (
        <Spin spinning={!mapLoaded} size="large">
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className="smap smap-style" ref={resultMap} />
        </Spin>
    );
};

export default ResultSMap;
