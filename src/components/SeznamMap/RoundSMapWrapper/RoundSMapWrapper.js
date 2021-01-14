import React from 'react';
import SeznamMap from '../SeznamMap';

const RoundSMapWrapper = ({
    click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue,
}) => {
    return (
        <SeznamMap
            type="round"
            click={click}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
        />
    );
};

export default RoundSMapWrapper;
