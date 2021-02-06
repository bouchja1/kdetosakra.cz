import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Progress, Typography } from 'antd';
import { ResultSMapWrapper } from '../components/SMap/ResultSMapWrapper';
import { roundToTwoDecimal } from '../util';
import { TOTAL_ROUNDS_MAX } from '../constants/game';
import useGameMenuResize from '../hooks/useGameMenuResize';

const { Title } = Typography;

const resultPathColors = ['#00bc57', '#6e45f9', '#29c2ff', '#f99b45', '#f945a9'];

export const Result = () => {
    useGameMenuResize();
    const lastResult = useSelector(state => state.result);
    const [playAgainSelected, setPlayAgainSelected] = useState(false);

    const { totalScore, guessedPoints } = lastResult;

    const closeResultPage = () => {
        setPlayAgainSelected(true);
    };

    if (totalScore && guessedPoints && guessedPoints.length && !playAgainSelected) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Celkové skóre</Title>
                            {totalScore}
                            {' '}
                            bodů
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Celková průměrná přesnost</Title>
                            <Progress type="circle" percent={roundToTwoDecimal(totalScore / TOTAL_ROUNDS_MAX)} />
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Vzdálenost od hádaného místa (km)</Title>
                            <div className="result-rounds-container">
                                {guessedPoints.map((round, i) => {
                                    return (
                                        <div key={i} className="result-round">
                                            <div
                                                className="result-round-color"
                                                style={{ backgroundColor: `${resultPathColors[i]}` }}
                                            />
                                            <div className="result-round-no">
                                                {i + 1}
                                                . kolo
                                            </div>
                                            <div className="result-round-distance">
                                                {roundToTwoDecimal(round.distance)}
                                                {' '}
                                                km
                                            </div>
                                            <div className="result-round-score">
                                                {Math.round(round.score)}
                                                {' '}
                                                bodů
                                            </div>
                                            {round?.currentCity && (
                                                <div className="result-round-other-info">
                                                    {round.currentCity.obec}
                                                    ,
                                                    {round.currentCity.okres}
                                                    ,
                                                    {' '}
                                                    {round.currentCity.kraj}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="result-modal-container-item" />
                    </div>
                </div>
                <div className="result-modal-container-item" style={{ marginBottom: '25px' }}>
                    <Button
                        onClick={() => {
                            closeResultPage();
                        }}
                        type="primary"
                    >
                        Hrát znovu
                    </Button>
                </div>
                <ResultSMapWrapper guessedPoints={guessedPoints} resultPathColors={resultPathColors} />
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};
