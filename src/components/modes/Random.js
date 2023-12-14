import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { generateRandomRadius } from '../../util';
import BattleLinkModal from '../BattleLinkModal';
import { GameStartButtons } from '../GameStartButtons';
import { SinglePlayerModal } from '../SinglePlayerModal';

export const Random = ({ multiplayerSupported }) => {
    const dispatch = useDispatch();
    const [battleModalVisible, setBattleModalVisible] = useState(false);
    const [playGame, setPlayGame] = useState(false);
    const [singlePlayerModalVisible, setSinglePlayerModalVisible] = useState(false);

    const handleBattleModalVisibility = isVisible => {
        setBattleModalVisible(isVisible);
    };

    const handleSinglePlayerModalVisibility = isVisible => {
        setSinglePlayerModalVisible(isVisible);
    };

    const handleClickStartGame = (resultMode, noMove = false) => {
        dispatch(
            setCurrentGame({
                mode: gameModes.random,
                round: 1,
                totalScore: 0,
                radius: generateRandomRadius(),
                city: null,
                guessResultMode: resultMode,
                regionNutCode: null,
                noMove,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: '/nahodne',
                }}
            />
        );
    }

    return (
        <>
            <GameStartButtons
                isMultiplayerSupported={multiplayerSupported}
                onSinglePlayerModalVisible={handleSinglePlayerModalVisibility}
                onBattleModalVisible={handleBattleModalVisibility}
            />
            <SinglePlayerModal
                visible={singlePlayerModalVisible}
                onModalVisibility={handleSinglePlayerModalVisibility}
                onClickStartGame={handleClickStartGame}
            />
            <BattleLinkModal
                visible={battleModalVisible}
                handleBattleModalVisibility={handleBattleModalVisibility}
                mode={gameModes.random}
            />
        </>
    );
};
