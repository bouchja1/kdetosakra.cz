import React, {useState} from 'react';
import {Redirect, useLocation} from 'react-router-dom';
import ResultSMapWrapper from "../SMap/ResultSMapWrapper";
import {roundToTwoDecimal} from "../../util/Util";

const Result = () => {
    const location = useLocation();
    const [resultPageClosed, setResultPageClosed] = useState(false);

    const closeResultPage = () => {
        setResultPageClosed(true);
    };

    if (location && location.state && location.state.totalRoundScore && location.state.guessedPoints && !resultPageClosed) {
        return (
            <div className="result-container">
                <h1>Výsledek: {roundToTwoDecimal(location.state.totalRoundScore)} bodů</h1>
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
