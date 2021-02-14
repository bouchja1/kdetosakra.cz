import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Progress } from 'antd';
import { roundToTwoDecimal } from '../../util';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import ResultSMap from '../../components/ResultSMap';
import { RoundsSummary } from './RoundsSummary';

export const SingleResult = ({ renderPlayAgainButton }) => {
    const lastResult = useSelector(state => state.result);

    const {
        totalScore, guessedPoints, mode, city, radius,
    } = lastResult;

    if (guessedPoints && guessedPoints.length) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <h3>Celkové skóre</h3>
                            {totalScore}
                            {' '}
                            bodů
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <h3>Celková průměrná přesnost</h3>
                            <Progress type="circle" percent={roundToTwoDecimal(totalScore / TOTAL_ROUNDS_MAX)} />
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
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
                        <div className="result-modal-container-item" />
                    </div>
                </div>
                {renderPlayAgainButton}
                <ResultSMap guessedPoints={guessedPoints} mode={mode} city={city} radius={radius} />
            </>
        );
    }

    return <Redirect to={{ pathname: '/' }} />;
};
