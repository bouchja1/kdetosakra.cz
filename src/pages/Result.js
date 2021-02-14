import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

import useGameMenuResize from '../hooks/useGameMenuResize';
import { BattleResult, SingleResult } from './results';

export const Result = () => {
    useGameMenuResize();
    const lastResult = useSelector(state => state.result);

    const { isBattle } = lastResult;

    // to load whole map layer again when the map is minimized before (otherwise breaks with JAK scrollLeft)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    const playAgainButton = () => (
        <div className="result-modal-container-item" style={{ marginBottom: '25px' }}>
            <Button type="primary">
                <Link
                    to={{
                        pathname: '/',
                    }}
                >
                    Zpět na výběr herního módu
                </Link>
            </Button>
        </div>
    );

    return isBattle ? (
        <BattleResult renderPlayAgainButton={playAgainButton()} />
    ) : (
        <SingleResult renderPlayAgainButton={playAgainButton()} />
    );
};
