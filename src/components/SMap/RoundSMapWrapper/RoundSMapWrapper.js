import React from 'react';
import SMap from '../SMap';

const RoundSMapWrapper = ({
    click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue,
}) => {
    return (
        <SMap
            type="round"
            click={click}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
        />
    );
};

export default RoundSMapWrapper;
