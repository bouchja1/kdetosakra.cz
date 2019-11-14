import React from 'react';
import { Layout } from 'antd';
import { Redirect, useLocation } from 'react-router-dom';
import Game from '../Game';
import useGameMenuResize from '../../hooks/useGameMenuResize';

const { Content } = Layout;

const SuggestedCity = () => {
    const location = useLocation();
    useGameMenuResize();

    if (location && location.state && location.state.city) {
        return (
            <Content>
                {/*
                <div className="game-mode-info-container">
                    <h2>Herní mód: Zvolené místo v Čr</h2>
                    <h3>Místo: {location.state.city.place}</h3>
                    {location.state.city.info ? <h3>{location.state.city.info}</h3> : null}
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

export default SuggestedCity;
