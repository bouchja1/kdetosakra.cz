import { Layout, Spin } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { HeraldryRoundResultModal } from '../../components/HeraldryRoundResultModal';
import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import useSMapResize from '../../hooks/useSMapResize';

const { Content } = Layout;

export const HeraldryGame = () => {
    const dispatch = useDispatch();
    const { width, height } = useSMapResize();
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    useGameMenuResize();

    const { mode, totalScore, city } = currentGame;

    // TODO total round score
    // TODO place

    if (mode === gameModes.heraldry && city) {
        return (
            <Content>
                <div className="game-screen-container">
                    {/* -40 padding of layout */}
                    <div className="panorama-container" style={{ height: height - 130, width: width - 40 }}>
                        <img
                            id="result-city-emblem"
                            src={city.coatOfArms}
                            alt={`Znak obce ${city.obec}`}
                            className="heraldry-city-emblem"
                        />
                    </div>
                </div>
                <HeraldryRoundResultModal
                    visible={resultModalVisible}
                    closeModal={() => setResultModalVisible(false)}
                    totalRoundScore={totalScore}
                    city={city}
                />
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
