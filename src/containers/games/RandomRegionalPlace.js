import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { generateRandomRadius } from '../../util';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const RandomRegionalPlace = () => {
    const currentGame = useSelector(state => state.game.currentGame);
    useGameMenuResize();

    const { radius, regionNutCode, noMove } = currentGame;

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
            <GameScreen mode={gameModes.randomRegion} radius={radius ?? generateRandomRadius()} noMove={noMove} />
        </Content>
    );
};
