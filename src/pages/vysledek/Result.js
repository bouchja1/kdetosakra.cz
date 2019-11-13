import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import ResultSMapWrapper from '../../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';
import { Button, Progress, Layout, Typography, Divider } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

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
                <Typography className="result-modal-container">
                    <div className="result-modal-container-item">
                        <Title level={2}>Celková průměrná přesnost</Title>
                        <Progress
                            type="circle"
                            percent={roundToTwoDecimal(location.state.totalRoundScore / TOTAL_ROUNDS_MAX)}
                        />
                    </div>
                    <Divider />
                    <ResultSMapWrapper guessedPoints={location.state.guessedPoints} closeResultPage={closeResultPage} />
                    <Divider />
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
                </Typography>
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};

export default Result;
