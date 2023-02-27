import { Modal } from 'antd';
import React from 'react';

const GuessLimitModal = ({ visible, handleGuessModalVisibility }) => {
    const handleCancel = () => {
        handleGuessModalVisibility(false);
    };

    return (
        <Modal open={visible} footer={null} onCancel={handleCancel}>
            <h2>Čas pro tvůj tip vypršel</h2>
            <p>Bohužel, v tomto kole jsi promeškal možnost umístit svůj tip a nezískáváš tak žádný bod.</p>
        </Modal>
    );
};

export default GuessLimitModal;
