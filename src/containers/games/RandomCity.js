import React from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentGame } from '../../redux/actions/game';
import { GameScreen } from '../GameScreen';
import { generateRandomRadius } from '../../util';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import gameModes from '../../enums/modes';

const { Content } = Layout;

export const RandomCity = () => {
    const dispatch = useDispatch();
    useGameMenuResize();
    const currentGame = useSelector(state => state.game.currentGame);

    const { mode, radius } = currentGame;

    // we want to access random game from everywhere - does not matter which city or radius or etc. is picked from the homepage
    if (mode !== gameModes.random) {
        dispatch(
            setCurrentGame({
                mode: gameModes.random,
                round: 1,
                totalScore: 0,
                radius: generateRandomRadius(),
            }),
        );
    }

    return (
        <Content>
            <GameScreen mode={gameModes.random} radius={radius ?? generateRandomRadius()} />
        </Content>
    );
};
