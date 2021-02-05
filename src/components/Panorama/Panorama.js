import React, { useContext, useEffect, useState } from 'react';
import { Spin } from 'antd';
import useWindowHeight from '../../hooks/useWindowHeight';
import MapyCzContext from '../../context/MapyCzContext';
import { DEFAULT_PANORAMA_TOLERANCE, MAX_PANORAMA_TRIES } from '../../constants/game';

export const panoramaSceneOptions = {
    nav: true,
    blend: 300,
    pitchRange: [0, 0], // zakazeme vertikalni rozhled
};

const Panorama = ({
    makeRefreshPanorama,
    panoramaScene,
    refPanoramaView,
    panoramaPlace,
    panoramaLoading,
    makeSetPanoramaLoading,
}) => {
    const mapyContext = useContext(MapyCzContext);
    const windowHeight = useWindowHeight();
    const [findPanoramaTriesCounter, setFindPanoramaTriesCounter] = useState(0);
    const [panoramaFounded, setPanoramaFounded] = useState(true);

    useEffect(() => {
        if (mapyContext.loadedMapApi && panoramaPlace && panoramaScene) {
            const { SMap } = mapyContext;
            // kolem teto pozice chceme nejblizsi panorama
            const position = SMap.Coords.fromWGS84(panoramaPlace.longitude, panoramaPlace.latitude);
            // hledame s toleranci 50m
            let tolerance = DEFAULT_PANORAMA_TOLERANCE;
            if (findPanoramaTriesCounter > 0) {
                tolerance = 5000;
            }

            const getBestPanorama = async () => {
                await SMap.Pano.getBest(position, tolerance)
                    .then(
                        place => {
                            panoramaScene.show(place);
                            makeSetPanoramaLoading(false);
                        },
                        () => {
                            // panorama could not be shown
                            if (findPanoramaTriesCounter < MAX_PANORAMA_TRIES) {
                                setFindPanoramaTriesCounter(findPanoramaTriesCounter + 1);
                                makeRefreshPanorama();
                            } else {
                                throw new Error('Panorama was not found');
                            }
                        },
                    )
                    .catch(err => {
                        setPanoramaFounded(false);
                    });
            };
            getBestPanorama();
        }
    }, [mapyContext.loadedMapApi, panoramaScene, panoramaPlace]);

    return (
        <Spin tip="Načítám panorama..." spinning={panoramaLoading}>
            {' '}
            <div className="panorama-container" style={{ height: windowHeight - 130 }}>
                {!panoramaFounded ? (
                    <p>V okruhu 5 km od vašeho místa nebylo nalezeno žádné panorama.</p>
                ) : (
                    <div ref={refPanoramaView} />
                )}
            </div>
        </Spin>
    );
};

export default Panorama;
