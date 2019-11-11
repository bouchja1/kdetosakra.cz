import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import ResultSMapWrapper from '../../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import HeaderContainer from '../../components/pageStructure/HeaderContainer';
import { Button, Progress } from 'antd';

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
                <div className="result-container">
                    <h1>
                        Výsledek:
                        <Progress percent={roundToTwoDecimal(location.state.totalRoundScore / TOTAL_ROUNDS_MAX)} />
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
