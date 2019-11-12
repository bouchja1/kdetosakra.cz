import React from 'react';
import SMap from '../SMap';

const RoundSMapWrapper = ({ click, refLayeredMapValue, refLayerValue, refVectorLayerSMapValue, location }) => {
    return (
        <SMap
            type="round"
            click={click}
            refLayeredMapValue={refLayeredMapValue}
            refLayerValue={refLayerValue}
            refVectorLayerSMapValue={refVectorLayerSMapValue}
            location={location}
        />
    );
};

export default RoundSMapWrapper;
