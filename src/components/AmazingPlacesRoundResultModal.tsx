import { Modal, Progress } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { TOTAL_ROUNDS_MAX } from '../constants/game';
import { AmazingPlace, CzechCity } from '../types/places';
import { roundToTwoDecimal } from '../util';
import { ConfettiAnimation } from './ConfettiAnimation';
import { HeraldryNextRoundButton } from './HeraldryNextRoundButton';

interface AmazingPlacesRoundResultModalProps {
    visible: boolean;
    closeModal: () => void;
    guessedAmazingPlace: AmazingPlace;
    roundGuessedDistance: number | null;
    roundScore: number;
}

export const AmazingPlacesRoundResultModal = ({
    visible,
    closeModal,
    guessedAmazingPlace,
    roundGuessedDistance,
    roundScore,
}: AmazingPlacesRoundResultModalProps) => {
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const componentIsMounted = useRef(true);

    useEffect(() => {
        // cleanup function
        return () => {
            componentIsMounted.current = false;
        };
    }, []); // no extra deps => the cleanup function run this on component unmount

    const { round: currentRound, totalScore } = currentGame;

    return (
        <Modal open={visible} onOk={closeModal} onCancel={closeModal} footer={null} centered destroyOnClose>
            {roundScore === 100 && <ConfettiAnimation />}
            <div className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <h2>
                            Kolo: {currentRound}/{TOTAL_ROUNDS_MAX}
                        </h2>
                        {roundGuessedDistance ? (
                            <p>
                                Vzdušná vzdálenost hádaného místa od tvého tipu:{' '}
                                <b>{roundToTwoDecimal(roundGuessedDistance)} km</b>
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
                    {totalScore >= 0 ? (
                        <div className="result-modal-container-item">
                            <h4>Průběžný počet bodů</h4>
                            {Math.round(totalScore)}
                        </div>
                    ) : null}
                </div>
                <div className="result-modal-container-more-info">
                    <h3>Bližší informace</h3>
                    <div className="result-modal-container-more-info-city">
                        <div
                            style={{
                                width: '100%',
                            }}
                        >
                            <h4 className="result-modal-container-more-info-city-headline">
                                {guessedAmazingPlace.name}
                            </h4>
                            <p>{guessedAmazingPlace.category}</p>
                        </div>
                    </div>
                    <div className="result-modal-container-more-info-wiki">
                        <a href="TODO" target="_blank" rel="noopener noreferrer">
                            <p>Více informací na XYZ (a dodat href)</p>
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
