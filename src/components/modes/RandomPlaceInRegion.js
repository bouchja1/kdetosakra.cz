import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { generateRandomRadius } from '../../util';
import BattleLinkModal from '../BattleLinkModal';
import { GameStartButtons } from '../GameStartButtons';
import { SinglePlayerModal } from '../SinglePlayerModal';

export const RandomPlaceInRegion = ({ multiplayerSupported, regionNutCode }) => {
    const dispatch = useDispatch();
    const [battleModalVisible, setBattleModalVisible] = useState(false);
    const [playGame, setPlayGame] = useState(false);
    const [singlePlayerModalVisible, setSinglePlayerModalVisible] = useState(false);

    const handleSinglePlayerModalVisibility = isVisible => {
        setSinglePlayerModalVisible(isVisible);
    };

    const handleBattleModalVisibility = isVisible => {
        setBattleModalVisible(isVisible);
    };

    const handleClickStartGame = resultMode => {
        ReactGA.event({
            category: CATEGORIES.RANDOM_PLACE_IN_REGION,
            action: 'Play random place in region',
        });
        dispatch(
            setCurrentGame({
                mode: gameModes.randomRegion,
                round: 1,
                totalScore: 0,
                radius: generateRandomRadius(),
                city: null,
                guessResultMode: resultMode,
                regionNutCode,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: '/nahodne-kraj',
                }}
            />
        );
    }

    return (
        <>
            {regionNutCode && (
                <GameStartButtons
                    isMultiplayerSupported={multiplayerSupported}
                    onSinglePlayerModalVisible={handleSinglePlayerModalVisibility}
                    onBattleModalVisible={handleBattleModalVisibility}
                />
            )}
            <SinglePlayerModal
                visible={singlePlayerModalVisible}
                onModalVisibility={handleSinglePlayerModalVisibility}
                onClickStartGame={handleClickStartGame}
            />
            <BattleLinkModal
                visible={battleModalVisible}
                handleBattleModalVisibility={handleBattleModalVisibility}
                mode={gameModes.randomRegion}
                regionNutCode={regionNutCode}
            />
        </>
    );
};
