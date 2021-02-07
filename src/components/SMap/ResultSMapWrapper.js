import React from 'react';
import SMap from './SMap';

export const ResultSMapWrapper = ({ guessedPoints, isGuessing, isBattle }) => {
    return <SMap type="result" guessedPoints={guessedPoints} isGuessing={isGuessing} isBattle={isBattle} />;
};
