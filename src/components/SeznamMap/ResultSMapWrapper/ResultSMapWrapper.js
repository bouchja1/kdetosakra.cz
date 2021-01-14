import React from 'react';
import SeznamMap from '../SeznamMap';

const ResultSMapWrapper = ({ guessedPoints, closeResultPage }) => {
    return <SeznamMap type="result" guessedPoints={guessedPoints} closeResultPage={closeResultPage} />;
};

export default ResultSMapWrapper;
