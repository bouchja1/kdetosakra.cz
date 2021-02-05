import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';
import MapyCzContext from '../../context/MapyCzContext';
import { DEFAUL_MARKER_ICON, MARKER_PLACE_ICON_KDETOSAKRA } from '../../constants/icons';
import useSMapResize from '../../hooks/useSMapResize';
import gameModes from '../../enums/modes';

const DEFAULT_MODE_ZOOM = 14;

const mouseControlOptions = {
    scrollDelay: 5000,
    maxDriftSpeed: 20,
    driftSlowdown: 0.5,
    // idleDelay: 550,
};

const markerOptions = {
    url: DEFAUL_MARKER_ICON,
    anchor: { left: 10, bottom: 1 },
};
const markerPanoramaOptions = {
    url: MARKER_PLACE_ICON_KDETOSAKRA,
    anchor: { left: 10, bottom: 15 },
};

const SMap = ({
    guessedPoints,
    type,
    onMapClick,
    refLayeredMapValue,
    refLayerValue,
    refVectorLayerSMapValue,
    mapSize,
}) => {
    const { width } = useSMapResize();
    const map = useRef();
    const mapyContext = useContext(MapyCzContext);
    const [instance, setInstance] = useState();
    const [mapLayer, setMapLayer] = useState();
    const currentGame = useSelector(state => state.game.currentGame);

    const { mode, city, radius } = currentGame;

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            let mapInstance;
            if ((mode === gameModes.geolocation || mode === gameModes.city || mode === gameModes.custom) && city) {
                mapInstance = initCityMapInstance();
            } else {
                const center = mapyContext.SMap.Coords.fromWGS84(15.202828, 50.027429);
                mapInstance = new mapyContext.SMap(map.current, center, 7);
            }
            const sync = new mapyContext.SMap.Control.Sync({ bottomSpace: 60 });
            mapInstance.addControl(sync); // - aby mapa reagovala na změnu velikosti průhledu - Synchronizuje mapu s portem, potažmo mapu s portem a oknem
            mapInstance.setZoomRange(7, 19);
            mapInstance.addDefaultLayer(mapyContext.SMap.DEF_BASE).enable();
            mapInstance.addDefaultControls(); // Vyrobí defaultní ovládácí prvky (kompas, zoom, ovládání myší a klávesnicí.)

            // Bitová maska určující, co všechno myš/prst ovládá - konstanty SMapContext.MOUSE_*
            const mouse = new mapyContext.SMap.Control.Mouse(
                // eslint-disable-next-line no-bitwise
                mapyContext.SMap.MOUSE_PAN | mapyContext.SMap.MOUSE_WHEEL | mapyContext.SMap.MOUSE_ZOOM,
                mouseControlOptions,
            ); /* Ovládání myší */
            mapInstance.addControl(mouse);

            // 8. vrstva se značkami
            if (!mapLayer) {
                const layerSMap = new mapyContext.SMap.Layer.Marker();
                mapInstance.addLayer(layerSMap);
                layerSMap.enable();
                setMapLayer(layerSMap);
            }

            /* znackova vrstva pro ikonky bodu zajmu; poiToolTip - zapneme title jako nazev nad POI */
            const poILayer = new mapyContext.SMap.Layer.Marker(undefined, {
                poiTooltip: true,
            });
            mapInstance.addLayer(poILayer).enable();

            /* dataProvider zastiti komunikaci se servery */
            const dataProvider = mapInstance.createDefaultDataProvider();
            dataProvider.setOwner(mapInstance);
            dataProvider.addLayer(poILayer);
            dataProvider.setMapSet(mapyContext.SMap.MAPSET_BASE);
            dataProvider.enable();

            setInstance(mapInstance);
        }
    }, [mapyContext.loadedMapApi]);

    const drawResultMap = (mapInstance, layerSMap) => {
        const options = {
            color: '#f00',
            width: 3,
        };
        const vectorLayer = new mapyContext.SMap.Layer.Geometry();
        mapInstance.addLayer(vectorLayer);
        vectorLayer.enable();
        for (let i = 0; i < guessedPoints.length; i++) {
            const pointsObject = guessedPoints[i];
            const pointPanorama = mapyContext.SMap.Coords.fromWGS84(
                pointsObject.pointPanorama.x,
                pointsObject.pointPanorama.y,
            );
            const pointMap = mapyContext.SMap.Coords.fromWGS84(pointsObject.pointMap.x, pointsObject.pointMap.y);
            const pointsVectorArray = [pointPanorama, pointMap];

            const path = new mapyContext.SMap.Geometry(
                mapyContext.SMap.GEOMETRY_POLYLINE,
                null,
                pointsVectorArray,
                options,
            );
            vectorLayer.addGeometry(path);

            // my guessed marker
            const marker = new mapyContext.SMap.Marker(
                mapyContext.SMap.Coords.fromWGS84(pointsObject.pointMap.x, pointsObject.pointMap.y),
                `Můj odhad ${i + 1}`,
                markerOptions,
            );
            layerSMap.addMarker(marker);
            // panorama place marker
            const markerPanorama = new mapyContext.SMap.Marker(
                mapyContext.SMap.Coords.fromWGS84(pointsObject.pointPanorama.x, pointsObject.pointPanorama.y),
                `Panorama ${i + 1}`,
                markerPanoramaOptions,
            );
            layerSMap.addMarker(markerPanorama);
        }
    };

    const initCityMapInstance = () => {
        // not random mode
        let defaultModeZoom = DEFAULT_MODE_ZOOM - 1;
        const center = mapyContext.SMap.Coords.fromWGS84(city.coordinates.longitude, city.coordinates.latitude);
        const mapInstance = new mapyContext.SMap(map.current, center, 7);
        if (radius > 2 && radius <= 6 && radius <= 10) {
            if (city.cityRange) {
                defaultModeZoom -= city.cityRange > 1 ? city.cityRange - 1 : city.cityRange;
            }
        } else if (radius > 6 && radius <= 10) {
            if (city.cityRange) {
                defaultModeZoom -= city.cityRange;
            }
        }
        mapInstance.setCenterZoom(
            mapyContext.SMap.Coords.fromWGS84(city.coordinates.longitude, city.coordinates.latitude),
            defaultModeZoom,
            true,
        );
        return mapInstance;
    };

    useEffect(() => {
        if (mapyContext.loadedMapApi && instance && mapLayer) {
            const { SMap: SMapContext } = mapyContext;

            if (type === 'result') {
                drawResultMap(instance, mapLayer);
            } else {
                // assign vrstva se značkami
                refLayerValue.current = mapLayer;
                // assing layered map value
                refLayeredMapValue.current = instance;
                refLayeredMapValue.current
                    .getSignals()
                    .addListener(window, 'map-click', onMapClick); /* Při signálu kliknutí volat tuto funkci */

                // vykreslit vektor do mapy
                const vectorLayer = new SMapContext.Layer.Geometry();
                refLayeredMapValue.current.addLayer(vectorLayer);
                vectorLayer.enable();
                refVectorLayerSMapValue.current = vectorLayer;
            }
        }
    }, [mapyContext.loadedMapApi, mapSize, instance, mapLayer]);

    return (
        <>
            {width <= 961 ? <Divider /> : null}
            <div
                id="smap"
                className={`${width > 960 ? 'smap smap-style' : 'smap'} ${type === 'result' ? 'smap-result' : ''}`}
                ref={map}
            />
        </>
    );
};

export default SMap;
