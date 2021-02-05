import React from 'react';
import SMap from './SMap';

export const RoundSMapWrapper = ({
    onMapClick,
    refLayeredMapValue,
    refLayerValue,
    refVectorLayerSMapValue,
    mapSize,
}) => {
    return (
        <SMap
            type="round"
            mapSize={mapSize}
            onMapClick={onMapClick}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
        />
    );
};
