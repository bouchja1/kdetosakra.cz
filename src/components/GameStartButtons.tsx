import { Button } from 'antd';
import React from 'react';

import { showMultiplayerWarningModal } from '../util/multiplayer';

interface GameStartButtonsProps {
    isMultiplayerSupported: boolean;
    onBattleModalVisible: (isVisible: boolean) => void;
    onSinglePlayerModalVisible: (isVisible: boolean) => void;
}

export const GameStartButtons = ({
    isMultiplayerSupported,
    onBattleModalVisible,
    onSinglePlayerModalVisible,
}: GameStartButtonsProps) => {
    return (
        <div className="game-start-button-group">
            <Button
                type="primary"
                className="button-play"
                onClick={() => {
                    onSinglePlayerModalVisible(true);
                }}
            >
                1 hráč
            </Button>
            <Button
                type="primary"
                className="button-play"
                onClick={() => {
                    if (isMultiplayerSupported) {
                        onBattleModalVisible(true);
                    } else {
                        showMultiplayerWarningModal();
                    }
                }}
            >
                Více hráčů
            </Button>
        </div>
    );
};
