import { resultPathColors } from '../constants/game';
import { DEFAUL_MARKER_ICON, MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import gameModes from '../enums/modes';
import { mapLayers } from '../redux/reducers/game';

export const DEFAULT_MODE_ZOOM = 14;

export const mouseControlOptions = {
    scrollDelay: 5000,
    maxDriftSpeed: 20,
    driftSlowdown: 0.5,
    // idleDelay: 550,
};

export const markerOptions = {
    url: DEFAUL_MARKER_ICON,
    anchor: { left: 10, bottom: 1 },
};
export const markerPanoramaOptions = {
    url: MARKER_PLACE_ICON_KDETOSAKRA,
    anchor: { left: 10, bottom: 15 },
};

export const initCityMapInstance = (SMap, mapRefValue, latCenter, lonCenter, radius, city, mode) => {
    // not random mode
    let defaultModeZoom = DEFAULT_MODE_ZOOM - 1;
    const center = SMap.Coords.fromWGS84(lonCenter, latCenter);
    const mapInstance = new SMap(mapRefValue, center, 7);
    if (radius > 2 && radius <= 6 && radius <= 10) {
        if (city.cityRange) {
            defaultModeZoom -= city.cityRange > 1 ? city.cityRange - 1 : city.cityRange;
        }
    } else if (radius > 6 && radius <= 10) {
        if (city.cityRange) {
            defaultModeZoom -= city.cityRange;
        }
    }

    if (mode === gameModes.randomRegion) {
        defaultModeZoom = 8;
    }

    mapInstance.setCenterZoom(
        SMap.Coords.fromWGS84(city.coordinates.longitude, city.coordinates.latitude),
        defaultModeZoom,
        true,
    );
    return mapInstance;
};

const drawResultPathToLayer = (SMap, layerWithMarks, vectorLayer, point, pathColor, markerName) => {
    const pointPanorama = SMap.Coords.fromWGS84(point.pointPanorama.x, point.pointPanorama.y);
    const pointMap = SMap.Coords.fromWGS84(point.pointMap.x, point.pointMap.y);
    const pointsVectorArray = [pointPanorama, pointMap];

    const path = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, pointsVectorArray, {
        color: pathColor,
        width: 3,
    });
    vectorLayer.addGeometry(path);

    // my guessed marker
    const marker = new SMap.Marker(
        SMap.Coords.fromWGS84(point.pointMap.x, point.pointMap.y),
        `Můj odhad ${markerName}`,
        markerOptions,
    );
    layerWithMarks.addMarker(marker);
    // panorama place marker
    const markerPanorama = new SMap.Marker(
        SMap.Coords.fromWGS84(point.pointPanorama.x, point.pointPanorama.y),
        `Panorama ${markerName}`,
        markerPanoramaOptions,
    );
    layerWithMarks.addMarker(markerPanorama);
};

export const drawAllResultsLayerToMap = (SMap, mapInstance, layerWithMarks, vectorLayer, guessedPoints) => {
    for (let i = 0; i < guessedPoints.length; i++) {
        const pointsObject = guessedPoints[i];
        // `Panorama ${i + 1}`
        if (pointsObject) {
            drawResultPathToLayer(SMap, layerWithMarks, vectorLayer, pointsObject, resultPathColors[i], `round${i}`);
        }
    }
};

export const drawSingleRoundResultLayerToMap = (SMap, mapInstance, layerWithMarks, currentRoundGuessedPoint) => {
    const vectorLayer = new SMap.Layer.Geometry();
    mapInstance.addLayer(vectorLayer);
    vectorLayer.enable();
    drawResultPathToLayer(SMap, layerWithMarks, vectorLayer, currentRoundGuessedPoint, '#f00', 'round');
};

export const getMapInstanceByGameMode = (SMap, mode, city, radius, mapRefValue) => {
    if (
        (mode === gameModes.geolocation ||
            mode === gameModes.city ||
            mode === gameModes.custom ||
            mode === gameModes.randomRegion) &&
        city
    ) {
        return initCityMapInstance(
            SMap,
            mapRefValue,
            city.coordinates.latitude,
            city.coordinates.longitude,
            radius,
            city,
            mode,
        );
    }
    const center = SMap.Coords.fromWGS84(15.202828, 50.027429);
    return new SMap(mapRefValue, center, 7);
};

export const setupMapInstance = (SMap, mapInstance, mapLayer) => {
    mapInstance.addDefaultControls(); // Vyrobí defaultní ovládácí prvky (kompas, zoom, ovládání myší a klávesnicí.)
    mapInstance.addControl(new SMap.Control.Sync()); // - aby mapa reagovala na změnu velikosti průhledu

    if (mapLayer === mapLayers.tourist) {
        mapInstance.addDefaultLayer(SMap.DEF_TURIST).enable();
        mapInstance.addDefaultLayer(SMap.DEF_BASE);
    } else {
        mapInstance.addDefaultLayer(SMap.DEF_TURIST);
        mapInstance.addDefaultLayer(SMap.DEF_BASE).enable();
    }

    mapInstance.setZoomRange(7, 19);

    // Bitová maska určující, co všechno myš/prst ovládá - konstanty SMapContext.MOUSE_*
    const mouse = new SMap.Control.Mouse(
        // eslint-disable-next-line no-bitwise
        SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM,
        mouseControlOptions,
    ); /* Ovládání myší */
    mapInstance.addControl(mouse);

    // switch between layers
    const layerSwitch = new SMap.Control.Layer({
        width: 65,
        items: 2,
        page: 2,
    });
    layerSwitch.addDefaultLayer(SMap.DEF_BASE);
    layerSwitch.addDefaultLayer(SMap.DEF_TURIST);
    mapInstance.addControl(layerSwitch, { left: '8px', top: '20px' });
};

export const setupLayerWithMarksAndDataProvider = (SMap, mapInstance) => {
    // vrstva se značkami
    const layerWithMarks = new SMap.Layer.Marker();
    mapInstance.addLayer(layerWithMarks);
    layerWithMarks.enable();

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

    return layerWithMarks;
};
