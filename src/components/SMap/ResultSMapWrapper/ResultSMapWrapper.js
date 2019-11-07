import React from 'react';
import SMap from "../SMap";

const ResultSMapWrapper = ({guessedPoints, closeResultPage}) => {

  return <SMap type="result" guessedPoints={guessedPoints} closeResultPage={closeResultPage} />
};

export default ResultSMapWrapper;
