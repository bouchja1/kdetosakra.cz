import React from 'react';
import { Button, Modal, Progress } from 'antd';
import { useSelector } from 'react-redux';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { roundToTwoDecimal } from '../../util';

const RoundResultModal = ({
    closeModal,
    visible,
    guessedDistance,
    roundScore,
    totalRoundScore,
    guessedPlace,
    isBattle,
}) => {
    const currentGame = useSelector(state => state.game.currentGame);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const { round } = currentGame;
    const { round: lastGuessedRound } = currentBattleInfo;

    const currentRound = isBattle ? lastGuessedRound : round;

    return (
        <Modal
            visible={visible}
            style={{ top: 20 }}
            onOk={() => closeModal(false)}
            onCancel={() => closeModal(false)}
            footer={null}
        >
            <div className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <h2>
                            Kolo:
                            {' '}
                            {currentRound}
                            /
                            {TOTAL_ROUNDS_MAX}
                        </h2>
                        {guessedDistance ? (
                            <p>
                                Vzdušná vzdálenost místa od tvého odhadu:
                                {' '}
                                <b>
                                    {roundToTwoDecimal(guessedDistance)}
                                    {' '}
                                    km
                                </b>
                            </p>
                        ) : null}
                    </div>
                ) : null}
                <div className="result-modal-container-row">
                    {roundScore >= 0 && guessedDistance ? (
                        <div className="result-modal-container-item">
                            <h3>Přesnost v rámci kola</h3>
                            {roundScore >= 0 && guessedDistance ? <Progress percent={roundScore} /> : null}
                        </div>
                    ) : null}
                    {totalRoundScore >= 0 ? (
                        <div className="result-modal-container-item">
                            <h3>Průběžný počet bodů</h3>
                            {roundToTwoDecimal(totalRoundScore)}
                        </div>
                    ) : null}
                </div>
                {guessedPlace && guessedDistance ? (
                    <div className="result-modal-container-item">
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <h3>Bližší informace</h3>
                            <p>
                                <b>Obec:</b>
                                {' '}
                                {guessedPlace.obec}
                            </p>
                            <p>
                                <b>Okres:</b>
                                {' '}
                                {guessedPlace.okres}
                            </p>
                            <p>
                                <b>Kraj:</b>
                                {' '}
                                {guessedPlace.kraj}
                            </p>
                        </div>
                    </div>
                ) : null}
                <div className="result-modal-button">
                    <Button key="submit" type="primary" onClick={() => closeModal(false)}>
                        Zavřít
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RoundResultModal;
