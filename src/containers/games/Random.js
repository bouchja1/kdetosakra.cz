import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { generateRandomRadius } from '../../util';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const Random = () => {
    const currentGame = useSelector(state => state.game.currentGame);
    useGameMenuResize();

    const { mode, radius, guessResultMode, noMove } = currentGame;

    if (radius && mode === gameModes.random && guessResultMode) {
        return (
            <Content>
                <GameScreen mode={gameModes.random} radius={radius ?? generateRandomRadius()} noMove={noMove} />
            </Content>
        );
    }

    return (
        <Redirect
            to={{
                pathname: '/',
            }}
        />
    );
};
