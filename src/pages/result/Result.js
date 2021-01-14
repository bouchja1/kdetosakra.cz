import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Button, Progress, Typography } from 'antd';
import ResultSMapWrapper from '../../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util';

const { Title } = Typography;

const Result = () => {
    const location = useLocation();
    const [playAgainSelected, setPlayAgainSelected] = useState(false);

    const closeResultPage = () => {
        setPlayAgainSelected(true);
    };

    if (location?.state?.totalRoundScore && location?.state?.guessedPoints && !playAgainSelected) {
        return (
            <>
                <Typography className="result-modal-container">
                    <div className="result-modal-container-item">
                        <Title level={2}>Celková průměrná přesnost</Title>
                        <Progress
                            type="circle"
                            percent={roundToTwoDecimal(location.state.totalRoundScore / TOTAL_ROUNDS_MAX)}
                        />
                    </div>
                    <div className="result-modal-container-item">
                        <Button
                            onClick={() => {
                                closeResultPage();
                            }}
                            type="primary"
                        >
                            Hrát znovu
                        </Button>
                    </div>
                    <ResultSMapWrapper guessedPoints={location.state.guessedPoints} closeResultPage={closeResultPage} />
                </Typography>
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};

export default Result;
