import React, {useState} from 'react';
import {Redirect, useLocation} from 'react-router-dom';
import ResultSMapWrapper from "../SMap/ResultSMapWrapper";

const Result = () => {
    const location = useLocation();
    const [resultPageClosed, setResultPageClosed] = useState(false);

    const closeResultPage = () => {
        setResultPageClosed(true);
    };

    if (location && location.state && location.state.totalRoundScore && location.state.guessedPoints && !resultPageClosed) {
        return (
            <div className="resultBlock">
                <h1>Výsledek: {location.state.totalRoundScore} bodů</h1>
                <ResultSMapWrapper guessedPoints={location.state.guessedPoints} closeResultPage={closeResultPage}/>
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