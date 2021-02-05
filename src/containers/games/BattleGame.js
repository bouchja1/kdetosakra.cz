import React from 'react';
import { Layout } from 'antd';
import { Redirect, useLocation } from 'react-router-dom';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

export const BattleGame = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location?.state?.battleId) {
        return (
            <Content>
                <>neco</>
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
