import { writeStorage } from '@rehooks/local-storage';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import maximizeMapShadow from '../../assets/images/map/maximizeMapShadow.png';
import minimizeMapShadow from '../../assets/images/map/minimizeMapShadowFull.png';
import minimizeMapShadowDisabled from '../../assets/images/map/minimizeMapShadowFullDisabled.png';
import useSMapResize from '../../hooks/useSMapResize';
import GuessingMap from '../GuessingMap';

interface LittleMapImageProps {
    mapDimension: 'min' | 'max' | 'normal';
    GuessingMapButton: ReactElement;
    visible: boolean;
    onSetMapDimension: (dimension: 'min' | 'max' | 'normal') => void;
    onSaveCurrentClickedMapPointCoordinates: (coordinates: any) => void;
}

export const LittleMapImage = ({
    mapDimension,
    GuessingMapButton,
    visible,
    onSaveCurrentClickedMapPointCoordinates,
    onSetMapDimension,
}: LittleMapImageProps) => {
    const [mapStyle, setMapStyle] = useState<CSSProperties | null>();
    const { width, height } = useSMapResize();

    useEffect(() => {
        if (width > 960) {
            if (!visible) {
                setMapStyle({ display: 'none' });
            }
            if (mapDimension === 'max') {
                setMapStyle({ height: height / 1.2, width: width / 1.5 });
            } else {
                setMapStyle({ height: height / 2, width: width / 3 });
            }
        } else {
            setMapStyle(null);
        }
    }, [width, height, mapDimension]);

    const getLittleMapResizers = (type: 'maxAndNormal' | 'minimized') => {
        if (type === 'maxAndNormal') {
            return (
                <>
                    <img
                        alt="Maximální velikost mapy"
                        className={`smap-collapsible-max-max ${mapDimension === 'max' ? 'max-max-disabled' : ''}`}
                        src={mapDimension === 'max' ? minimizeMapShadowDisabled : minimizeMapShadow}
                        onClick={() => {
                            setMapStyle({ height: height / 1.2, width: width / 1.5 });
                            onSetMapDimension('max');
                            writeStorage('smapDimension', 'max');
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                    ;
                    <img
                        alt="Normální velikost mapy"
                        className="smap-collapsible-max"
                        src={minimizeMapShadow}
                        onClick={() => {
                            if (mapDimension === 'max') {
                                setMapStyle({ height: height / 2, width: width / 3 });
                                onSetMapDimension('normal');
                                writeStorage('smapDimension', 'normal');
                            } else if (mapDimension === 'normal') {
                                onSetMapDimension('min');
                                writeStorage('smapDimension', 'min');
                            }
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                    ;
                </>
            );
        }

        return (
            <img
                alt="Zmenšená mapa"
                className="smap-collapsible-min"
                src={maximizeMapShadow}
                onClick={() => {
                    onSetMapDimension('normal');
                    writeStorage('smapDimension', 'normal');
                    window.dispatchEvent(new Event('resize'));
                }}
            />
        );
    };

    const getSMapCollapseMin = () => {
        if (width > 960) {
            return { height: 100, width: 100 };
        }
    };

    return (
        <>
            {visible && mapDimension !== 'min' && (
                <div
                    id="smap-container"
                    className="smap-container"
                    style={{
                        ...mapStyle,
                        ...(isMobile && {
                            height: height - 110,
                        }),
                    }}
                >
                    {getLittleMapResizers('maxAndNormal')}
                    <GuessingMap
                        currentRoundGuessedPoint={currentRoundGuessedPoint}
                        refLayerValue={refLayerValue}
                        roundGuessed={roundGuessed}
                        refVectorLayerSMapValue={refVectorLayerSMapValue}
                        saveCurrentClickedMapPointCoordinates={onSaveCurrentClickedMapPointCoordinates}
                    />
                    {GuessingMapButton}
                </div>
            )}
            {mapDimension === 'min' && (
                <div className="smap-container" style={getSMapCollapseMin()}>
                    {getLittleMapResizers('minimized')}
                </div>
            )}
        </>
    );
};
