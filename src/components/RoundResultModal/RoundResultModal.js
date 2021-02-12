import React from 'react';
import {
    Button, Modal, Progress, Typography
} from 'antd';
import { useSelector } from 'react-redux';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { roundToTwoDecimal } from '../../util';

const { Title, Paragraph, Text } = Typography;

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
            footer={[
                <div className="result-modal-button">
                    <Button key="submit" type="primary" onClick={() => closeModal(false)}>
                        Okej
                    </Button>
                </div>,
            ]}
        >
            <Typography className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <Title level={2}>
                            Kolo:
                            {' '}
                            {currentRound}
                            /
                            {TOTAL_ROUNDS_MAX}
                        </Title>
                        {guessedDistance ? (
                            <Paragraph>
                                Vzdušná vzdálenost místa od tvého odhadu:
                                {' '}
                                <Text className="highlighted">
                                    {roundToTwoDecimal(guessedDistance)}
                                    {' '}
                                    km
                                </Text>
                            </Paragraph>
                        ) : null}
                    </div>
                ) : null}
                {roundScore >= 0 && guessedDistance ? (
                    <div className="result-modal-container-item">
                        <Title level={3}>Přesnost v rámci kola</Title>
                        {roundScore >= 0 && guessedDistance ? <Progress percent={roundScore} /> : null}
                    </div>
                ) : null}
                {totalRoundScore >= 0 ? (
                    <div className="result-modal-container-item">
                        <Paragraph>
                            Průběžný počet bodů:
                            {' '}
                            <Text className="highlighted">{roundToTwoDecimal(totalRoundScore)}</Text>
                        </Paragraph>
                    </div>
                ) : null}
                {guessedPlace && guessedDistance ? (
                    <div className="result-modal-container-item">
                        <Title level={4}>Bližší informace</Title>
                        <Paragraph>
                            <Text className="highlighted">Obec:</Text>
                            {' '}
                            {guessedPlace.obec}
                        </Paragraph>
                        <Paragraph>
                            <Text className="highlighted">Okres:</Text>
                            {' '}
                            {guessedPlace.okres}
                        </Paragraph>
                        <Paragraph>
                            <Text className="highlighted">Kraj:</Text>
                            {' '}
                            {guessedPlace.kraj}
                        </Paragraph>
                    </div>
                ) : null}
            </Typography>
        </Modal>
    );
};

export default RoundResultModal;
