import { Button } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TOTAL_ROUNDS_MAX } from '../constants/game';
import { routeNames } from '../constants/routes';

interface HeraldryNextRoundButtonProps {
    onGuessNextRound: () => void;
    onShowResult: () => void;
}

export const HeraldryNextRoundButton = ({ onGuessNextRound, onShowResult }: HeraldryNextRoundButtonProps) => {
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);

    const { round } = currentGame;

    return (
        <>
            {round >= TOTAL_ROUNDS_MAX ? (
                <Button type="primary" onClick={onShowResult}>
                    <Link
                        to={{
                            pathname: `/${routeNames.vysledek}`,
                        }}
                    >
                        Vyhodnotit hru
                    </Link>
                </Button>
            ) : (
                <Button onClick={onGuessNextRound} type="primary">
                    Další kolo
                </Button>
            )}
        </>
    );
};
