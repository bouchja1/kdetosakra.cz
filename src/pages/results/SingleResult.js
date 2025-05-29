import { Button, Progress } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { DonateContent } from '../../components/DonateContent';
import ResultSMap from '../../components/ResultSMap';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { RoundsSummary } from './RoundsSummary';

export const SingleResult = () => {
    const lastResult = useSelector(state => state.result);

    const { totalScore, guessedPoints, mode, city, radius } = lastResult;

    if (guessedPoints && guessedPoints.length) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Celkové skóre</h3>
                            {totalScore} bodů
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Celková průměrná přesnost</h3>
                            <Progress type="circle" percent={Math.round(totalScore / TOTAL_ROUNDS_MAX)} />
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Vzdálenost od hádaného místa (km)</h3>
                            <div className="result-rounds-container">
                                {guessedPoints.map((round, i) => {
                                    return (
                                        <RoundsSummary
                                            index={i}
                                            playerName="player"
                                            roundScore={round.score}
                                            roundDistance={round.distance}
                                            roundCity={round?.currentCity}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className="result-container-item" />
                    </div>
                </div>
                <div className="result-container-item" style={{ marginBottom: '25px' }}>
                    <Button size="large" type="primary">
                        <Link
                            to={{
                                pathname: '/',
                            }}
                        >
                            Zpět na výběr herního módu
                        </Link>
                    </Button>
                </div>
                <DonateContent marginBottom={25} withDonate />
                <ResultSMap guessedPoints={guessedPoints} mode={mode} city={city} radius={radius} />
            </>
        );
    }

    return <Redirect to={{ pathname: '/' }} />;
};
