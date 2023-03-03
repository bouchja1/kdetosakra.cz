import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { TOTAL_ROUNDS_MAX } from '../constants/game';
import { AmazingPlace, CzechCity } from '../types/places';
import { ConfettiAnimation } from './ConfettiAnimation';
import { HeraldryNextRoundButton } from './HeraldryNextRoundButton';

interface HeraldryRoundResultModalProps {
    visible: boolean;
    guessedAmazingPlace: AmazingPlace;
    guessSuccessful: boolean;
    roundGuessedDistance: number | null;
}

export const AmazingPlacesRoundResultModal = ({
    visible,
    guessedAmazingPlace,
    guessSuccessful,
    roundGuessedDistance,
}: HeraldryRoundResultModalProps) => {
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const componentIsMounted = useRef(true);

    useEffect(() => {
        // cleanup function
        return () => {
            componentIsMounted.current = false;
        };
    }, []); // no extra deps => the cleanup function run this on component unmount

    const { round: currentRound, roundScore, totalRoundScore } = currentGame;

    return (
        <Modal open={visible} footer={null} centered destroyOnClose closable={false}>
            {guessSuccessful && <ConfettiAnimation />}
            <div className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <h2>
                            Kolo: {currentRound}/{TOTAL_ROUNDS_MAX}
                        </h2>
                    </div>
                ) : null}
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
