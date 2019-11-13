import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import ResultSMapWrapper from '../../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import { Button, Progress, Layout } from 'antd';
const { Content } = Layout;

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
            <Content className="result">
                <div className="result-container">
                    <h1>
                        Průměrná přesnost:
                        <Progress
                            type="circle"
                            percent={roundToTwoDecimal(location.state.totalRoundScore / TOTAL_ROUNDS_MAX)}
                        />
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
            </Content>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};

export default Result;
