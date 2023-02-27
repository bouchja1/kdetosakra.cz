import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const CustomPlace = () => {
    useGameMenuResize();
    const currentGame = useSelector(state => state.game.currentGame);

    const { radius, city, mode, noMove } = currentGame;

    if (city && radius && mode === gameModes.custom) {
        return (
            <Content>
                <GameScreen mode={mode} radius={radius} city={city} noMove={noMove} />
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
