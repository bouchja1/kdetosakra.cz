import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import ResultSMapWrapper from '../../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import HeaderContainer from '../../components/pageStructure/HeaderContainer';
import { Button } from 'antd';

const Result = () => {
    const location = useLocation();
    const [resultPageClosed, setResultPageClosed] = useState(false);

    const closeResultPage = () => {
        setResultPageClosed(true);
    };

    if (
        location &&
        location.state &&
        location.state.totalRoundScore !== null &&
        location.state.guessedPoints &&
        !resultPageClosed
    ) {
        return (
            <>
                <HeaderContainer />
                <div className="result-container">
                    <h1>
                        Výsledek:
                        {roundToTwoDecimal(location.state.totalRoundScore / TOTAL_ROUNDS_MAX)}
                        procent
                    </h1>
                </div>
                <ResultSMapWrapper guessedPoints={location.state.guessedPoints} closeResultPage={closeResultPage} />
                <Button
                    onClick={() => {
                        closeResultPage();
                    }}
                    type="primary"
                >
                    Hrát znovu
                </Button>
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};

export default Result;
