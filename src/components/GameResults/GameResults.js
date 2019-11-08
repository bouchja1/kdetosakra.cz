import React from 'react';
import { roundToTwoDecimal, TOTAL_ROUNDS_MAX } from '../../util/Util';

const GameResults = ({ totalRounds, totalRoundScore, roundScore, guessedDistance, guessedPlace }) => {
    return (
        <>
            {totalRounds > 0 ? (
                <p>
                    Kolo: {totalRounds}/{TOTAL_ROUNDS_MAX}
                </p>
            ) : null}
            {totalRoundScore ? <p>Celkové skóre: {roundToTwoDecimal(totalRoundScore)}</p> : null}
            {guessedDistance ? (
                <p>Vzdušná vzdálenost místa od tvého odhadu: {roundToTwoDecimal(guessedDistance)} km</p>
            ) : null}
            {roundScore >= 0 && guessedDistance ? <p>Skóre: {roundScore}</p> : null}
            {guessedPlace && guessedDistance ? (
                <>
                    <p>Obec: {guessedPlace.obec}</p>
                    <p>Okres: {guessedPlace.okres}</p>
                    <p>Kraj: {guessedPlace.kraj}</p>
                </>
            ) : null}
        </>
    );
};

export default GameResults;
