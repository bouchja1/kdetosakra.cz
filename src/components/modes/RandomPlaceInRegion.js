import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { routeNames } from '../../constants/routes';
import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { generateRandomRadius } from '../../util';
import BattleLinkModal from '../BattleLinkModal';
import { GameStartButtons } from '../GameStartButtons';
import { SinglePlayerModal } from '../SinglePlayerModal';

const coordsByRegionNutCode = {
    CZ010: {
        latitude: 50.0886981,
        longitude: 14.4034269,
    },
    CZ032: {
        latitude: 49.738531,
        longitude: 13.373737,
    },
    CZ072: {
        latitude: 49.224537,
        longitude: 17.662863,
    },
    CZ042: {
        latitude: 50.661216,
        longitude: 14.053246,
    },
    CZ063: {
        latitude: 49.41586,
        longitude: 15.595469,
    },
    CZ071: {
        latitude: 49.593878,
        longitude: 17.250979,
    },
    CZ051: {
        latitude: 50.76638,
        longitude: 15.054439,
    },
    CZ053: {
        latitude: 50.034409,
        longitude: 15.781299,
    },
    CZ080: {
        latitude: 49.821023,
        longitude: 18.262624,
    },
    CZ052: {
        latitude: 50.210461,
        longitude: 15.825311,
    },
    CZ020: {
        latitude: 50.0886981,
        longitude: 14.4034269,
    },
    CZ064: {
        latitude: 49.19516,
        longitude: 16.606937,
    },
    CZ031: {
        latitude: 48.975758,
        longitude: 14.480355,
    },
    CZ041: {
        latitude: 50.231952,
        longitude: 12.872062,
    },
};

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

    const handleClickStartGame = (resultMode, noMove = false) => {
        dispatch(
            setCurrentGame({
                mode: gameModes.randomRegion,
                round: 1,
                totalScore: 0,
                radius: generateRandomRadius(),
                city: {
                    coordinates: {
                        ...coordsByRegionNutCode[regionNutCode],
                    },
                },
                guessResultMode: resultMode,
                regionNutCode,
                noMove,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: `/${routeNames.nahodneKraj}`,
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
