import React from 'react';
import SMap from "../SMap";

const ResultSMapWrapper = ({guessedPoints}) => {

  return <SMap type="result" guessedPoints={guessedPoints} />
};

export default ResultSMapWrapper;
