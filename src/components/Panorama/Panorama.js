import { Spin } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { DEFAULT_PANORAMA_TOLERANCE, MAX_PANORAMA_TRIES, guessResultMode } from '../../constants/game';
import MapyCzContext from '../../context/MapyCzContext';
import useSMapResize from '../../hooks/useSMapResize';
import { wasLatLonPanoramaUsedInCurrentGame } from '../../util/game';

export const getPanoramaSceneOptions = (noMove = false) => {
    return {
        nav: noMove ? false : true,
        blend: 300,
        pitchRange: [0, 0], // zakazeme vertikalni rozhled
    };
};

const GoBackToTheBeginning = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    background: #c80707;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    border-radius: 4px;

    &:hover {
        background: #c43939;
        cursor: pointer;
    }
`;

const Panorama = ({
    panoramaScene,
    refPanoramaView,
    originalPanoramaPlace,
    bestPanoramaPlace,
    panoramaLoading,
    changePanoramaLoadingState,
    isGameStarted,
    isBattle,
    onSetBestPanoramaPlace,
}) => {
    const mapyContext = useContext(MapyCzContext);
    const { width, height } = useSMapResize();
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [findPanoramaTriesCounter, setFindPanoramaTriesCounter] = useState(0);
    const [panoramaFounded, setPanoramaFounded] = useState(true);

    const { guessResultMode: guessResultModeSinglePlayer, rounds } = currentGame;
    const { guessResultMode: guessResultModeBattle } = currentBattleInfo;

    const showGoBackToTheBeginning = useMemo(() => {
        const isPanoramaLoaded = panoramaScene && bestPanoramaPlace;

        if (isBattle) {
            if (guessResultModeBattle === guessResultMode.end && isPanoramaLoaded) {
                return true;
            }
        } else if (guessResultModeSinglePlayer === guessResultMode.end && isPanoramaLoaded) {
            return true;
        }
        return false;
    }, [isBattle, guessResultModeSinglePlayer, guessResultModeBattle, panoramaScene, bestPanoramaPlace]);

    useEffect(() => {
        if (mapyContext.loadedMapApi && originalPanoramaPlace && panoramaScene && isGameStarted) {
            const { SMap } = mapyContext;
            // kolem teto pozice chceme nejblizsi panorama
            const position = SMap.Coords.fromWGS84(originalPanoramaPlace.longitude, originalPanoramaPlace.latitude);
            // we are looking for panorama with the default tolerance as 50 meters, then increasing about 300 meters every try
            let tolerance = DEFAULT_PANORAMA_TOLERANCE;
            if (findPanoramaTriesCounter > 0) {
                tolerance = findPanoramaTriesCounter * 300;
                if (findPanoramaTriesCounter === MAX_PANORAMA_TRIES) {
                    tolerance = 5000;
                }
            }

            const getBestPanorama = async () => {
                // hledame s toleranci 50m, zobrazujeme panoramy do roku 2019, jinak je potreba placeneho api
                await SMap.Pano.getBest(position, tolerance)
                    .then(
                        place => {
                            const { lat, lon } = place._data.mark;
                            const alreadyFoundPanorama = wasLatLonPanoramaUsedInCurrentGame(lat, lon, rounds);
                            if (alreadyFoundPanorama) {
                                setFindPanoramaTriesCounter(findPanoramaTriesCounter + 1);
                            } else {
                                onSetBestPanoramaPlace(place);
                                panoramaScene.show(place, {});
                                changePanoramaLoadingState(false);
                                setFindPanoramaTriesCounter(0);
                            }
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

            if (!bestPanoramaPlace) {
                getBestPanorama();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        mapyContext.loadedMapApi,
        panoramaScene,
        originalPanoramaPlace,
        isGameStarted,
        findPanoramaTriesCounter,
        onSetBestPanoramaPlace,
        bestPanoramaPlace,
        rounds,
    ]);

    const isPanoramaLoading = !originalPanoramaPlace || !isGameStarted || panoramaLoading || !bestPanoramaPlace;

    const handleGoBackToTheBeginning = () => {
        if (bestPanoramaPlace) {
            panoramaScene.show(bestPanoramaPlace, {});
        }
    };

    return (
        <Spin
            tip={!isGameStarted ? 'Čekám, až budou všichni hráči připraveni' : 'Načítám panorama, čekej prosím...'}
            spinning={isPanoramaLoading}
            size="large"
        >
            {/* -40 padding of layout */}
            <div className="panorama-container" style={{ height: height - 75, width }}>
                {!panoramaFounded ? (
                    <p>V okruhu 5 km od vašeho místa nebylo nalezeno žádné panorama.</p>
                ) : (
                    <>
                        {showGoBackToTheBeginning && (
                            <GoBackToTheBeginning onClick={handleGoBackToTheBeginning}>
                                Zpět na výchozí místo
                            </GoBackToTheBeginning>
                        )}
                        <div ref={refPanoramaView} style={{ width: '100%' }} />
                    </>
                )}
            </div>
        </Spin>
    );
};

export default Panorama;
