import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { setTotalRoundCounter } from '../../redux/actions/game';

const GuessingMapButton = ({
    refreshMap,
    isBattle,
    makeShowGameResult,
    guessRound,
    guessBattleRound,
    round,
    roundGuessed,
    disabled,
    currentRound,
    nextRoundButtonVisible,
}) => {
    const dispatch = useDispatch();

    const evaluateGame = isBattle ? currentRound >= TOTAL_ROUNDS_MAX && roundGuessed : currentRound >= TOTAL_ROUNDS_MAX;

    return (
        <>
            {evaluateGame ? (
                <Button type="primary" onClick={makeShowGameResult}>
                    Vyhodnotit hru
                </Button>
            ) : (
                <>
                    {/* TODO vyresit isGuessed && !isRoundActive */}
                    {!nextRoundButtonVisible ? (
                        <Button disabled={disabled} onClick={isBattle ? guessBattleRound : guessRound} type="primary">
                            Hádej!
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
