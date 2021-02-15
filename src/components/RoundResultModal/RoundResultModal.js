import React from 'react';
import { Button, Modal, Progress } from 'antd';
import { useSelector } from 'react-redux';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { roundToTwoDecimal } from '../../util';

const RoundResultModal = ({
    closeModal,
    visible,
    roundGuessedDistance,
    roundScore,
    totalRoundScore,
    guessedRandomPlace,
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
                        {roundGuessedDistance ? (
                            <p>
                                Vzdušná vzdálenost hádaného místa od tvého tipu:
                                {' '}
                                <b>
                                    {roundToTwoDecimal(roundGuessedDistance)}
                                    {' '}
                                    km
                                </b>
                            </p>
                        ) : null}
                    </div>
                ) : null}
                <div className="result-modal-container-row">
                    {roundScore >= 0 && roundGuessedDistance ? (
                        <div className="result-modal-container-item">
                            <h4>Přesnost v rámci kola</h4>
                            {roundScore >= 0 && roundGuessedDistance ? <Progress percent={roundScore} /> : null}
                        </div>
                    ) : null}
                    {totalRoundScore >= 0 ? (
                        <div className="result-modal-container-item">
                            <h4>Průběžný počet bodů</h4>
                            {roundToTwoDecimal(totalRoundScore)}
                        </div>
                    ) : null}
                </div>
                {guessedRandomPlace && roundGuessedDistance ? (
                    <div className="result-modal-container-item">
                        <h3>Bližší informace</h3>
                        <p>
                            <b>Obec:</b>
                            {' '}
                            {guessedRandomPlace.obec}
                        </p>
                        <p>
                            <b>Okres:</b>
                            {' '}
                            {guessedRandomPlace.okres}
                        </p>
                        <p>
                            <b>Kraj:</b>
                            {' '}
                            {guessedRandomPlace.kraj}
                        </p>
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
