import React from 'react';
import SMap from './SMap';

export const RoundSMapWrapper = ({
    onMapClick,
    refLayeredMapValue,
    refLayerValue,
    refVectorLayerSMapValue,
    isBattle,
    currentRoundGuessedPoint,
}) => {
    return (
        <SMap
            type="round"
            onMapClick={onMapClick}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
            isBattle={isBattle}
            currentRoundGuessedPoint={currentRoundGuessedPoint}
        />
    );
};
