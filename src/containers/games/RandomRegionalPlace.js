import React from 'react';
import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { GameScreen } from '../GameScreen';
import { generateRandomRadius } from '../../util';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import gameModes from '../../enums/modes';

const { Content } = Layout;

export const RandomRegionalPlace = () => {
    const currentGame = useSelector(state => state.game.currentGame);
    useGameMenuResize();

    const { radius, regionNutCode } = currentGame;

    if (!regionNutCode) {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }

    return (
        <Content>
            <GameScreen mode={gameModes.randomRegion} radius={radius ?? generateRandomRadius()} />
        </Content>
    );
};
