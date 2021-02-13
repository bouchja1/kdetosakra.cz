import React from 'react';
import SMap from './SMap';

export const ResultSMapWrapper = ({ currentRoundGuessedPoint, isGuessing, isBattle }) => {
    return (
        <SMap
            type="result"
            currentRoundGuessedPoint={currentRoundGuessedPoint}
            isGuessing={isGuessing}
            isBattle={isBattle}
        />
    );
};
