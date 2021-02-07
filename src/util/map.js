import { DEFAUL_MARKER_ICON, MARKER_PLACE_ICON_KDETOSAKRA } from '../constants/icons';
import { resultPathColors } from '../constants/game';
import gameModes from '../enums/modes';

const DEFAULT_MODE_ZOOM = 14;

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

export const initCityMapInstance = (SMap, mapRefValue, latCenter, lonCenter, radius, city) => {
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

export const drawAllResultsLayerToMap = (SMap, mapInstance, layerWithMarks, guessedPoints) => {
    const vectorLayer = new SMap.Layer.Geometry();
    mapInstance.addLayer(vectorLayer);
    vectorLayer.enable();
    for (let i = 0; i < guessedPoints.length; i++) {
        const pointsObject = guessedPoints[i];
        // `Panorama ${i + 1}`
        drawResultPathToLayer(SMap, layerWithMarks, vectorLayer, pointsObject, resultPathColors[i], `round${i}`);
    }
};

export const drawSingleRoundResultLayerToMap = (SMap, mapInstance, layerWithMarks, point) => {
    const vectorLayer = new SMap.Layer.Geometry();
    mapInstance.addLayer(vectorLayer);
    vectorLayer.enable();
    drawResultPathToLayer(SMap, layerWithMarks, vectorLayer, point, '#f00', 'round');
};

export const getMapInstanceByGameMode = (SMap, mode, city, radius, mapRefValue) => {
    if ((mode === gameModes.geolocation || mode === gameModes.city || mode === gameModes.custom) && city) {
        return initCityMapInstance(
            SMap,
            mapRefValue,
            city.coordinates.latitude,
            city.coordinates.longitude,
            radius,
            city,
        );
    }
    const center = SMap.Coords.fromWGS84(15.202828, 50.027429);
    return new SMap(mapRefValue, center, 7);
};

export const setupMapInstanceAndLayers = (SMap, mapInstance) => {
    const sync = new SMap.Control.Sync({ bottomSpace: 60 });
    mapInstance.addControl(sync); // - aby mapa reagovala na změnu velikosti průhledu - Synchronizuje mapu s portem, potažmo mapu s portem a oknem
    mapInstance.setZoomRange(7, 19);
    mapInstance.addDefaultLayer(SMap.DEF_BASE).enable();
    mapInstance.addDefaultControls(); // Vyrobí defaultní ovládácí prvky (kompas, zoom, ovládání myší a klávesnicí.)

    // Bitová maska určující, co všechno myš/prst ovládá - konstanty SMapContext.MOUSE_*
    const mouse = new SMap.Control.Mouse(
        // eslint-disable-next-line no-bitwise
        SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM,
        mouseControlOptions,
    ); /* Ovládání myší */
    mapInstance.addControl(mouse);

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
};
