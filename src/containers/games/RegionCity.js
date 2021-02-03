import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { GameScreen } from '../GameScreen';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

export const RegionCity = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location?.state?.radius && location?.state?.city) {
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
