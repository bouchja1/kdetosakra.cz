import React, { useEffect } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Game from '../Game';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

const City = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location && location.state && location.state.radius && location.state.city) {
        return (
            <Content>
                <div className="game-mode-info-container">
                    <h2>Herní mód: {location.state.city.fullName}</h2>
                    <h3>Maximální vzdálenost od místa: {location.state.radius} km</h3>
                </div>
                <Game location={location} />
            </Content>
        );
    } else {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }
};

export default City;
