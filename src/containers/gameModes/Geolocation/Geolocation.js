import React from 'react';
import { Layout } from 'antd';
import { Redirect, useLocation } from 'react-router-dom';
import Game from '../../Game';
import useGameMenuResize from '../../../hooks/useGameMenuResize';

const { Content } = Layout;

const Geolocation = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location?.state?.radius && location?.state?.city) {
        return (
            <Content>
                <Game location={location} />
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

export default Geolocation;
