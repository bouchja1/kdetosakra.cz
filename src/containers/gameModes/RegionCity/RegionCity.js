import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Game from '../../Game';
import useGameMenuResize from '../../../hooks/useGameMenuResize';

const { Content } = Layout;

const RegionCity = () => {
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

export default RegionCity;
