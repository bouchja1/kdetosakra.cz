import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MapyContext from '../../context/MapyContext';
import { DEFAUL_MARKER_ICON, DEFAUL_MARKER_PLACE_ICON } from '../../util/Util';

const DEFAULT_MODE_ZOOM = 14;

const SMap = props => {
    const location = useLocation();
    const [map] = useState(React.createRef());
    const mapyContext = useContext(MapyContext);
    const { closeResultPage } = props;

    const initSMap = () => {
        const SMap = mapyContext.SMap;

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

        let mapInstance;
        if (SMap) {
            let defaultModeZoom = DEFAULT_MODE_ZOOM - 1;
            if (
                (typeof location !== 'undefined' &&
                    location.hasOwnProperty('state') &&
                    location.state.mode === 'geolocation') ||
                location.state.mode === 'city' ||
                location.state.mode === 'suggested'
            ) {
                const center = SMap.Coords.fromWGS84(
                    location.state.city.coordinates.longitude,
                    location.state.city.coordinates.latitude,
                );
                mapInstance = new SMap(map.current, center, 7);
                const locationModeRadius = location.state.radius;
                if (locationModeRadius > 2 && locationModeRadius <= 6 && locationModeRadius <= 10) {
                    if (location.state.city.cityRange) {
                        defaultModeZoom =
                            defaultModeZoom -
                            (location.state.city.cityRange > 1
                                ? location.state.city.cityRange - 1
                                : location.state.city.cityRange);
                    }
                } else if (locationModeRadius > 6 && locationModeRadius <= 10) {
                    if (location.state.city.cityRange) {
                        defaultModeZoom = defaultModeZoom - location.state.city.cityRange;
                    }
                }
                mapInstance.setCenterZoom(
                    SMap.Coords.fromWGS84(
                        location.state.city.coordinates.longitude,
                        location.state.city.coordinates.latitude,
                    ),
                    defaultModeZoom,
                    true,
                );
            } else {
                const center = SMap.Coords.fromWGS84(15.202828, 50.027429);
                mapInstance = new SMap(map.current, center, 7);
            }
            mapInstance.addDefaultControls(); // Vyrobí defaultní ovládácí prvky (kompas, zoom, ovládání myší a klávesnicí.)
            mapInstance.addControl(new SMap.Control.Sync()); // - aby mapa reagovala na změnu velikosti průhledu - Synchronizuje mapu s portem, potažmo mapu s portem a oknem
            mapInstance.addDefaultLayer(SMap.DEF_BASE).enable();
            mapInstance.setZoomRange(7, 19);

            const mouse = new SMap.Control.Mouse(
                SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM,
                mouseControlOptions,
            ); /* Ovládání myší */
            mapInstance.addControl(mouse);

            // 8. vrstva se značkami
            const layerSMap = new SMap.Layer.Marker();
            mapInstance.addLayer(layerSMap);
            layerSMap.enable();

            /* znackova vrstva pro ikonky bodu zajmu; poiToolTip - zapneme title jako nazev nad POI */
            const poILayer = new SMap.Layer.Marker(undefined, {
                poiTooltip: true,
            });
            mapInstance.addLayer(poILayer).enable();

            /* dataProvider zastiti komunikaci se servery */
            const dataProvider = mapInstance.createDefaultDataProvider();
            dataProvider.setOwner(mapInstance);
            dataProvider.addLayer(poILayer);
            dataProvider.setMapSet(SMap.MAPSET_BASE);
            dataProvider.enable();

            if (props.type && props.type === 'result') {
                const { guessedPoints } = props;
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
                    const pointMap = mapyContext.SMap.Coords.fromWGS84(
                        pointsObject.pointMap.x,
                        pointsObject.pointMap.y,
                    );
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
            } else if (props.type === 'round') {
                const { click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue } = props;
                // assign vrstva se značkami
                refLayerValue.current = layerSMap;
                // assing layered map value
                refLayeredMapValue.current = mapInstance;
                refLayeredMapValue.current
                    .getSignals()
                    .addListener(window, 'map-click', click); /* Při signálu kliknutí volat tuto funkci */

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
            <div className="smap" ref={map}></div>
        </>
    );
};

export default SMap;
