import { Divider } from 'antd';
import React, { useContext, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSMapResize from '../../hooks/useSMapResize';
import MapyCzContext from '../../context/MapyCzContext';
import { getMapInstanceByGameMode, setupMapInstanceAndLayers, drawAllResultsLayerToMap } from '../../util/map';

const ResultSMap = ({ guessedPoints, isBattle }) => {
    const { width } = useSMapResize();
    const map = useRef();
    const mapyContext = useContext(MapyCzContext);
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const { mode, city, radius } = currentGame;
    const {
        mode: battleMode, radius: battleRadius, rounds, round,
    } = currentBattleInfo;

    const initSMap = () => {
        const mapInstance = isBattle
            ? getMapInstanceByGameMode(mapyContext.SMap, mode, city, radius, map.current)
            : getMapInstanceByGameMode(mapyContext.SMap, battleMode, rounds[round - 1].city, battleRadius, map.current);
        setupMapInstanceAndLayers(mapyContext.SMap, mapInstance);

        // vrstva se značkami
        const layerWithMarks = new mapyContext.SMap.Layer.Marker();
        mapInstance.addLayer(layerWithMarks);
        layerWithMarks.enable();

        drawAllResultsLayerToMap(mapyContext.SMap, mapInstance, layerWithMarks, guessedPoints);
    };

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            initSMap();
        }
    }, [mapyContext.loadedMapApi]);

    return (
        <>
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className="smap smap-style" ref={map} />
        </>
    );
};

export default ResultSMap;
