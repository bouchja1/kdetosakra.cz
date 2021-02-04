import React, {
    useContext, useEffect, useRef, useState
} from 'react';
import useWindowHeight from '../../hooks/useWindowHeight';
import KdetosakraContext from '../../context/KdetosakraContext';
import { DEFAULT_PANORAMA_TOLERANCE, MAX_PANORAMA_TRIES } from '../../constants/game';
import { pointInCircle } from '../../util';

const panoramaSceneOptions = {
    nav: true,
    blend: 300,
    pitchRange: [0, 0], // zakazeme vertikalni rozhled
};

const generatePlaceInRadius = (radius, locationCity) => {
    radius *= 1000; // to meters
    const generatedPlace = pointInCircle(
        {
            longitude: locationCity.coordinates.longitude,
            latitude: locationCity.coordinates.latitude,
        },
        radius,
    );
    return generatedPlace;
};

const Panorama = ({
    radius, city, refresh, makeRefreshPanorama, panoramaScene, makePanoramaScene,
}) => {
    const mapyContext = useContext(KdetosakraContext);
    const windowHeight = useWindowHeight();
    const panoramaView = useRef();
    const [findPanoramaTriesCounter, setFindPanoramaTriesCounter] = useState(0);
    const [panoramaFounded, setPanoramaFounded] = useState(true);

    useEffect(() => {
        if (mapyContext.loadedMapApi && !panoramaScene) {
            makePanoramaScene(new mapyContext.SMap.Pano.Scene(panoramaView.current, panoramaSceneOptions));
        }
    }, [mapyContext.loadedMapApi]);

    useEffect(() => {
        if (mapyContext.loadedMapApi && radius && city && panoramaScene) {
            const { SMap } = mapyContext;
            // kolem teto pozice chceme nejblizsi panorama
            const generatedPanoramaPlace = generatePlaceInRadius(radius, city);
            const position = SMap.Coords.fromWGS84(generatedPanoramaPlace.longitude, generatedPanoramaPlace.latitude);
            // hledame s toleranci 50m
            let tolerance = DEFAULT_PANORAMA_TOLERANCE;
            if (findPanoramaTriesCounter > 0) {
                tolerance = 5000;
            }

            SMap.Pano.getBest(position, tolerance)
                .then(
                    place => {
                        panoramaScene.show(place);
                    },
                    () => {
                        // panorama could not be shown
                        if (findPanoramaTriesCounter < MAX_PANORAMA_TRIES) {
                            setFindPanoramaTriesCounter(findPanoramaTriesCounter + 1);
                            makeRefreshPanorama(radius, city);
                        } else {
                            throw new Error('Panorama was not found');
                        }
                    },
                )
                .catch(err => {
                    setPanoramaFounded(false);
                });
        }
    }, [radius, city, mapyContext.loadedMapApi, panoramaScene, refresh]);

    return (
        <div className="panorama-container" style={{ height: windowHeight - 130 }}>
            {!panoramaFounded ? (
                <p>V okruhu 5 km od vašeho místa nebylo nalezeno žádné panorama.</p>
            ) : (
                <div ref={panoramaView} />
            )}
        </div>
    );
};

export default Panorama;
