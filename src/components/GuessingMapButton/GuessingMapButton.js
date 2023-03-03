import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { routeNames } from '../../constants/routes';
import { setTotalRoundCounter } from '../../redux/actions/game';
import { setLastResult } from '../../redux/actions/result';

const GuessingMapButton = ({
    refreshMap,
    isBattle = false,
    guessSingleplayerRound,
    guessBattleRound = null,
    allGuessedPoints,
    round,
    totalScore,
    roundGuessed,
    disabled,
    currentRound,
    currentGame,
    nextRoundButtonVisible,
}) => {
    const dispatch = useDispatch();

    return (
        <>
            {currentRound >= TOTAL_ROUNDS_MAX && roundGuessed ? (
                <Button
                    size="large"
                    type="primary"
                    onClick={() => {
                        dispatch(
                            setLastResult({
                                guessedPoints: allGuessedPoints,
                                totalScore,
                                mode: currentGame?.mode,
                                city: currentGame?.city,
                                radius: currentGame?.radius,
                                isBattle,
                            }),
                        );
                    }}
                >
                    <Link
                        to={{
                            pathname: `/${routeNames.vysledek}`,
                        }}
                    >
                        Vyhodnotit hru
                    </Link>
                </Button>
            ) : (
                <>
                    {!nextRoundButtonVisible ? (
                        <Button
                            disabled={disabled}
                            onClick={async () => {
                                if (isBattle && guessBattleRound) {
                                    await guessBattleRound();
                                } else {
                                    await guessSingleplayerRound();
                                }
                            }}
                            type="primary"
                            size="large"
                        >
                            <>{disabled ? 'Umísti svůj tip na mapu!' : 'Hádat!'}</>
                        </Button>
                    ) : null}
                    {!isBattle && nextRoundButtonVisible ? (
                        <Button
                            onClick={() => {
                                refreshMap();
                                if (round < TOTAL_ROUNDS_MAX) {
                                    dispatch(setTotalRoundCounter(round + 1));
                                }
                            }}
                            type="primary"
                            size="large"
                        >
                            Další kolo
                        </Button>
                    ) : null}
                </>
            )}
        </>
    );
};

export default GuessingMapButton;
