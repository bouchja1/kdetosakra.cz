import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { CATEGORIES } from '../../enums/gaCategories';
import { generateRandomRadius } from '../../util';
import { setCurrentGame } from '../../redux/actions/game';
import gameModes from '../../enums/modes';
import BattleLinkModal from '../BattleLinkModal';
import { showMultiplayerWarningModal } from '../../util/multiplayer';

export const RandomPlaceInRegion = ({ multiplayerSupported, regionNutCode }) => {
    const dispatch = useDispatch();
    const [battleModalVisible, setBattleModalVisible] = useState(false);

    const handleBattleModalVisibility = isVisible => {
        setBattleModalVisible(isVisible);
    };

    return (
        <>
            <div className="game-start-button-group">
                <Button
                    type="primary"
                    className="button-play"
                    disabled={!regionNutCode}
                    onClick={() => {
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
                                regionNutCode,
                            }),
                        );
                    }}
                >
                    <Link
                        to={{
                            pathname: '/nahodne-kraj',
                        }}
                    >
                        1 hráč
                    </Link>
                </Button>
                <Button
                    type="primary"
                    className="button-play"
                    disabled={!regionNutCode}
                    onClick={() => {
                        if (multiplayerSupported) {
                            setBattleModalVisible(true);
                        } else {
                            showMultiplayerWarningModal();
                        }
                    }}
                >
                    Více hráčů
                </Button>
            </div>
            <BattleLinkModal
                visible={battleModalVisible}
                handleBattleModalVisibility={handleBattleModalVisibility}
                mode={gameModes.randomRegion}
                regionNutCode={regionNutCode}
            />
        </>
    );
};
