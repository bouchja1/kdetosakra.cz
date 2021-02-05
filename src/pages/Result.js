import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Progress, Typography } from 'antd';
import { ResultSMapWrapper } from '../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal } from '../util';
import { TOTAL_ROUNDS_MAX } from '../constants/game';

const { Title } = Typography;

export const Result = () => {
    const lastResult = useSelector(state => state.result);
    const [playAgainSelected, setPlayAgainSelected] = useState(false);

    const { totalScore, guessedPoints } = lastResult;

    const closeResultPage = () => {
        setPlayAgainSelected(true);
    };

    if (totalScore && guessedPoints && guessedPoints.length && !playAgainSelected) {
        return (
            <>
                <Typography className="result-modal-container">
                    <div className="result-modal-container-item">
                        <Title level={2}>Celková průměrná přesnost</Title>
                        <Progress type="circle" percent={roundToTwoDecimal(totalScore / TOTAL_ROUNDS_MAX)} />
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
                    <ResultSMapWrapper guessedPoints={guessedPoints} />
                </Typography>
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};
