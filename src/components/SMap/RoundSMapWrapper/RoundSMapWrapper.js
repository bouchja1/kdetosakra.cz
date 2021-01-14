import React from 'react';
import SMap from '../SMap';

const RoundSMapWrapper = ({
    onMapClick, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue,
}) => {
    return (
        <SMap
            type="round"
            onMapClick={onMapClick}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
        />
    );
};

export default RoundSMapWrapper;
