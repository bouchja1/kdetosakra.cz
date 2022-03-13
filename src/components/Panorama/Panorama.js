import React, { useContext, useEffect, useState } from 'react';
import { Spin } from 'antd';
import MapyCzContext from '../../context/MapyCzContext';
import { DEFAULT_PANORAMA_TOLERANCE, MAX_PANORAMA_TRIES } from '../../constants/game';
import useSMapResize from '../../hooks/useSMapResize';

export const panoramaSceneOptions = {
    nav: true,
    blend: 300,
    pitchRange: [0, 0], // zakazeme vertikalni rozhled
};

const Panorama = ({
    panoramaScene,
    refPanoramaView,
    panoramaPlace,
    panoramaLoading,
    changePanoramaLoadingState,
    isGameStarted,
}) => {
    const mapyContext = useContext(MapyCzContext);
    const { width, height } = useSMapResize();
    const [findPanoramaTriesCounter, setFindPanoramaTriesCounter] = useState(0);
    const [panoramaFounded, setPanoramaFounded] = useState(true);

    useEffect(() => {
        if (mapyContext.loadedMapApi && panoramaPlace && panoramaScene && isGameStarted) {
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
                            changePanoramaLoadingState(false);
                        },
                        () => {
                            // panorama could not be shown
                            if (findPanoramaTriesCounter < MAX_PANORAMA_TRIES) {
                                setFindPanoramaTriesCounter(findPanoramaTriesCounter + 1);
                            } else {
                                changePanoramaLoadingState(false);
                                throw new Error('Panorama was not found');
                            }
                        },
                    )
                    .catch(err => {
                        setPanoramaFounded(false);
                    });
            };
            changePanoramaLoadingState(true);
            getBestPanorama();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapyContext.loadedMapApi, panoramaScene, panoramaPlace, isGameStarted, findPanoramaTriesCounter]);

    const isPanoramaLoading = !panoramaPlace || !isGameStarted || panoramaLoading;

    return (
        <Spin
            tip={!isGameStarted ? 'Čekám, až budou všichni hráči připraveni' : 'Načítám panorama, čekej prosím...'}
            spinning={isPanoramaLoading}
            size="large"
        >
            {/* -40 padding of layout */}
            <div className="panorama-container" style={{ height: height - 130, width: width - 40 }}>
                {!panoramaFounded ? (
                    <p>V okruhu 5 km od vašeho místa nebylo nalezeno žádné panorama.</p>
                ) : (
                    <div ref={refPanoramaView} style={{ width: '100%' }} />
                )}
            </div>
        </Spin>
    );
};

export default Panorama;
