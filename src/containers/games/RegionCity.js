import React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { GameScreen } from '../GameScreen';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import gameModes from '../../enums/modes';

const { Content } = Layout;

export const RegionCity = () => {
    useGameMenuResize();
    const currentGame = useSelector(state => state.game.currentGame);

    const { mode, radius, city } = currentGame;

    if (radius && mode === gameModes.city && city) {
        return (
            <Content>
                <GameScreen mode={mode} radius={radius} city={city} />
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
