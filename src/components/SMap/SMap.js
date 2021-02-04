import React, { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Divider } from 'antd';
import KdetosakraContext from '../../context/KdetosakraContext';
import { DEFAUL_MARKER_ICON, DEFAUL_MARKER_PLACE_ICON } from '../../constants/icons';
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
    url: DEFAUL_MARKER_PLACE_ICON,
    anchor: { left: 10, bottom: 15 },
};

const SMap = ({
    guessedPoints, type, onMapClick, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue,
}) => {
    const location = useLocation();
    const { width } = useSMapResize();
    const map = useRef();
    const mapyContext = useContext(KdetosakraContext);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            const { SMap: SMapContext } = mapyContext;

            let mapInstance;
            if (SMapContext) {
                let defaultModeZoom = DEFAULT_MODE_ZOOM - 1;
                const locationStateMode = location?.state?.mode;
                if (
                    locationStateMode === gameModes.geolocation
                    || locationStateMode === gameModes.city
                    || locationStateMode === gameModes.custom
                ) {
                    // not random mode
                    const center = SMapContext.Coords.fromWGS84(
                        location.state.city.coordinates.longitude,
                        location.state.city.coordinates.latitude,
                    );
                    mapInstance = new SMapContext(map.current, center, 7);
                    const locationModeRadius = location.state.radius;
                    if (locationModeRadius > 2 && locationModeRadius <= 6 && locationModeRadius <= 10) {
                        if (location.state.city.cityRange) {
                            defaultModeZoom
                                -= location.state.city.cityRange > 1
                                    ? location.state.city.cityRange - 1
                                    : location.state.city.cityRange;
                        }
                    } else if (locationModeRadius > 6 && locationModeRadius <= 10) {
                        if (location.state.city.cityRange) {
                            defaultModeZoom -= location.state.city.cityRange;
                        }
                    }
                    mapInstance.setCenterZoom(
                        SMapContext.Coords.fromWGS84(
                            location.state.city.coordinates.longitude,
                            location.state.city.coordinates.latitude,
                        ),
                        defaultModeZoom,
                        true,
                    );
                } else {
                    const center = SMapContext.Coords.fromWGS84(15.202828, 50.027429);
                    mapInstance = new SMapContext(map.current, center, 7);
                }
                mapInstance.addDefaultControls(); // Vyrobí defaultní ovládácí prvky (kompas, zoom, ovládání myší a klávesnicí.)
                mapInstance.addControl(new SMapContext.Control.Sync()); // - aby mapa reagovala na změnu velikosti průhledu - Synchronizuje mapu s portem, potažmo mapu s portem a oknem
                mapInstance.addDefaultLayer(SMapContext.DEF_BASE).enable();
                mapInstance.setZoomRange(7, 19);

                // Bitová maska určující, co všechno myš/prst ovládá - konstanty SMapContext.MOUSE_*
                const mouse = new SMapContext.Control.Mouse(
                    // eslint-disable-next-line no-bitwise
                    SMapContext.MOUSE_PAN | SMapContext.MOUSE_WHEEL | SMapContext.MOUSE_ZOOM,
                    mouseControlOptions,
                ); /* Ovládání myší */
                mapInstance.addControl(mouse);

                // 8. vrstva se značkami
                const layerSMap = new SMapContext.Layer.Marker();
                mapInstance.addLayer(layerSMap);
                layerSMap.enable();

                /* znackova vrstva pro ikonky bodu zajmu; poiToolTip - zapneme title jako nazev nad POI */
                const poILayer = new SMapContext.Layer.Marker(undefined, {
                    poiTooltip: true,
                });
                mapInstance.addLayer(poILayer).enable();

                /* dataProvider zastiti komunikaci se servery */
                const dataProvider = mapInstance.createDefaultDataProvider();
                dataProvider.setOwner(mapInstance);
                dataProvider.addLayer(poILayer);
                dataProvider.setMapSet(SMapContext.MAPSET_BASE);
                dataProvider.enable();

                if (type === 'result') {
                    const options = {
                        color: '#f00',
                        width: 3,
                    };
                    const vectorLayer = new SMapContext.Layer.Geometry();
                    mapInstance.addLayer(vectorLayer);
                    vectorLayer.enable();
                    for (let i = 0; i < guessedPoints.length; i++) {
                        const pointsObject = guessedPoints[i];
                        const pointPanorama = SMapContext.Coords.fromWGS84(
                            pointsObject.pointPanorama.x,
                            pointsObject.pointPanorama.y,
                        );
                        const pointMap = SMapContext.Coords.fromWGS84(pointsObject.pointMap.x, pointsObject.pointMap.y);
                        const pointsVectorArray = [pointPanorama, pointMap];

                        const path = new SMapContext.Geometry(
                            SMapContext.GEOMETRY_POLYLINE,
                            null,
                            pointsVectorArray,
                            options,
                        );
                        vectorLayer.addGeometry(path);

                        // my guessed marker
                        const marker = new SMapContext.Marker(
                            SMapContext.Coords.fromWGS84(pointsObject.pointMap.x, pointsObject.pointMap.y),
                            `Můj odhad ${i + 1}`,
                            markerOptions,
                        );
                        layerSMap.addMarker(marker);
                        // panorama place marker
                        const markerPanorama = new SMapContext.Marker(
                            SMapContext.Coords.fromWGS84(pointsObject.pointPanorama.x, pointsObject.pointPanorama.y),
                            `Panorama ${i + 1}`,
                            markerPanoramaOptions,
                        );
                        layerSMap.addMarker(markerPanorama);
                    }
                } else {
                    // assign vrstva se značkami
                    refLayerValue.current = layerSMap;
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
            }
        }
    }, [mapyContext.loadedMapApi]);

    return (
        <>
            {width <= 961 ? <Divider /> : null}
            <div id="smap" className={width > 960 ? 'smap smap-style' : 'smap'} ref={map} />
        </>
    );
};

export default SMap;
