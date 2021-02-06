import { Modal } from 'antd';

export const showMultiplayerWarningModal = () => {
    Modal.warning({
        title: 'Multiplayer není pro toto rozlišení podporován',
        content: 'Pokud chceš hrát proti přátelům, otevři si kdetosakra.cz na zařízení s vyšším rozlišením.',
    });
};
