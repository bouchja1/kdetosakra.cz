import { Button, Modal, RadioChangeEvent } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import React, { useState } from 'react';

import { guessResultMode } from '../constants/game';
import { GuessResultMode } from './GuessResultMode';

interface SinglePlayerModalProps {
    visible: boolean;
    onModalVisibility: (isVisible: boolean) => void;
    onClickStartGame: (guessResultMode: string, noMove?: boolean) => void;
}

export const SinglePlayerModal = ({ visible, onModalVisibility, onClickStartGame }: SinglePlayerModalProps) => {
    const [resultModeValue, setResultModeValue] = useState(guessResultMode.end);
    const [noMoveValue, setNoMoveValue] = useState(false);

    const handleCancel = () => {
        onModalVisibility(false);
    };

    const handleOnChange = (e: RadioChangeEvent) => {
        setResultModeValue(e.target.value);
    };

    const handleOnNoMoveChange = (e: CheckboxChangeEvent) => {
        setNoMoveValue(e.target.checked);
    };

    return (
        <Modal open={visible} footer={null} onCancel={handleCancel}>
            <h2>Hra jednoho hráče</h2>
            <GuessResultMode
                value={resultModeValue}
                noMoveValue={noMoveValue}
                onChange={handleOnChange}
                onNoMoveChange={handleOnNoMoveChange}
                withAdvancedOptions
            />
            <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button size="large" type="primary" onClick={() => onClickStartGame(resultModeValue, noMoveValue)}>
                        Hrát
                    </Button>
                </div>
            </>
        </Modal>
    );
};
