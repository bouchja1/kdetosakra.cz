import React from 'react';
import { Layout } from 'antd';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GameScreen } from '../GameScreen';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import gameModes from '../../enums/modes';

const { Content } = Layout;

export const CustomPlace = () => {
    useGameMenuResize();
    const currentGame = useSelector(state => state.game.currentGame);

    const { radius, city, mode } = currentGame;

    if (city && radius && mode === gameModes.custom) {
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
