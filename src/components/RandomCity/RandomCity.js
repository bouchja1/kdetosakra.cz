import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Link, Redirect, useLocation } from 'react-router-dom';
import Game from '../Game';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

const RandomCity = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location && location.state && location.state.mode === 'random') {
        return (
            <Content>
                {/*
                <div className="game-mode-info-container">
                    <h2>Herní mód: Náhodné místo v Čr</h2>
                </div>
                */}
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

export default RandomCity;
