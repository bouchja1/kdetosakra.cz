import React from 'react';
import SMap from './SMap';

export const ResultSMapWrapper = ({ guessedPoints, resultPathColors }) => {
    return <SMap type="result" guessedPoints={guessedPoints} resultPathColors={resultPathColors} />;
};
