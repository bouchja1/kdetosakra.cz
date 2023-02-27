import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const RegionCity = () => {
    const currentGame = useSelector(state => state.game.currentGame);
    useGameMenuResize();

    const { mode, radius, city, noMove } = currentGame;

    if (radius && mode === gameModes.city && city) {
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
