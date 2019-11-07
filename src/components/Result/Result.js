import React from 'react';
import {Redirect, useLocation} from 'react-router-dom';
import ResultSMapWrapper from "../SMap/ResultSMapWrapper";

const Result = () => {
    const location = useLocation();

    console.log("LOCATION STATE: ", location.state)

    if (location && location.state && location.state.totalRoundScore && location.state.guessedPoints) {
        return (
            <div className="resultBlock">
                <h1>Výsledek: {location.state.totalRoundScore} bodů</h1>
                <ResultSMapWrapper guessedPoints={location.state.guessedPoints}/>
            </div>
        )
    } else {
        return <Redirect
            to={{
                pathname: '/',
            }}
        />
    }
};

export default Result;
