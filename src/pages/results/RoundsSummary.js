import React from 'react';
import { resultPathColors } from '../../constants/game';
import { roundToTwoDecimal } from '../../util';

export const RoundsSummary = ({
    index, roundScore, roundDistance, roundCity,
}) => {
    return (
        <div key={index} className="result-round">
            <div className="result-round-color" style={{ backgroundColor: `${resultPathColors[index]}` }} />
            <div className="result-round-no">
                {index + 1}
                . kolo
            </div>
            <div className="result-round-distance">
                {roundToTwoDecimal(roundDistance)}
                {' '}
                km
            </div>
            <div className="result-round-score">
                {Math.round(roundScore)}
                {' '}
                bodů
            </div>
            {roundCity?.obec && (
                <div className="result-round-other-info">
                    <p>
                        {roundCity.obec}
                        {', '}
                        {roundCity.okres}
                        {', '}
                        {roundCity.kraj}
                    </p>
                </div>
            )}
        </div>
    );
};
