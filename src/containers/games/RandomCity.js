import React from 'react';
import { Layout } from 'antd';
import { Redirect, useLocation } from 'react-router-dom';
import { GameScreen } from '../GameScreen';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

export const RandomCity = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location?.state?.mode === 'random') {
        return (
            <Content>
                <GameScreen location={location} />
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
