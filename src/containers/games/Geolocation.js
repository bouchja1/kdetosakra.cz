import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GameScreen } from '../GameScreen';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import gameModes from '../../enums/modes';

const { Content } = Layout;

export const Geolocation = () => {
    useGameMenuResize();
    const currentGame = useSelector(state => state.game.currentGame);

    const { radius, city, mode } = currentGame;

    if (radius && city && mode === gameModes.geolocation) {
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
