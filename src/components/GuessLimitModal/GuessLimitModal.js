import React from 'react';
import { Modal } from 'antd';

const GuessLimitModal = ({ visible, handleGuessModalVisibility }) => {
    const handleCancel = () => {
        handleGuessModalVisibility(false);
    };

    return (
        <Modal visible={visible} footer={null} onCancel={handleCancel}>
            <h2>Čas pro tvůj tip vypršel</h2>
            <p>Bohužel, v tomto kole jsi promeškal možnost umístit svůj tip a nezískáváš tak žádný bod.</p>
        </Modal>
    );
};

export default GuessLimitModal;
