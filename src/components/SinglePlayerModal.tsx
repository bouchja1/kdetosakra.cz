import { Button, Modal, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';

import { guessResultMode } from '../constants/game';
import { GuessResultMode } from './GuessResultMode';

interface SinglePlayerModalProps {
    visible: boolean;
    onModalVisibility: (isVisible: boolean) => void;
    onClickStartGame: (guessResultMode: string) => void;
}

export const SinglePlayerModal = ({ visible, onModalVisibility, onClickStartGame }: SinglePlayerModalProps) => {
    const [resultModeValue, setResultModeValue] = useState(guessResultMode.end);

    const handleCancel = () => {
        onModalVisibility(false);
    };

    const handleOnChange = (e: RadioChangeEvent) => {
        setResultModeValue(e.target.value);
    };

    return (
        <Modal open={visible} footer={null} onCancel={handleCancel}>
            <h2>Hra jednoho hráče</h2>
            <GuessResultMode value={resultModeValue} onChange={handleOnChange} />
            <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button type="primary" onClick={() => onClickStartGame(resultModeValue)}>
                        Hrát
                    </Button>
                </div>
            </>
        </Modal>
    );
};
