import React from 'react';
import SMap from './SMap';

export const ResultSMapWrapper = ({ guessedPoints, isGuessing }) => {
    return <SMap type="result" guessedPoints={guessedPoints} isGuessing={isGuessing} />;
};
