import React from 'react';
import { Modal, Typography } from 'antd';

const { Title } = Typography;

const GuessLimitModal = ({ visible, handleGuessModalVisibility }) => {
    const handleCancel = () => {
        handleGuessModalVisibility(false);
    };

    return (
        <Modal visible={visible} footer={null} onCancel={handleCancel}>
            <Title level={4}>Čas pro tvůj tip vypršel</Title>
            <p>Bohužel, v tomto kole jsi promeškal možnost umístit svůj tip a nezískáváš tak žádný bod.</p>
        </Modal>
    );
};

export default GuessLimitModal;
