import { Modal, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { TOTAL_ROUNDS_MAX } from '../constants/game';
import { findMunicipalityMetadata } from '../services/wikipedia.mjs';
import { CzechCity } from '../types/places';
import { getHeraldryDescriptionForCity } from '../util/heraldry';
import { ConfettiAnimation } from './ConfettiAnimation';
import { HeraldryNextRoundButton } from './HeraldryNextRoundButton';

interface HeraldryRoundResultModalProps {
    visible: boolean;
    onGuessNextRound: () => void;
    onShowResult: () => void;
    city: CzechCity;
    guessedCity: CzechCity;
}

export const HeraldryRoundResultModal = ({
    onShowResult,
    onGuessNextRound,
    visible,
    city,
    guessedCity,
}: HeraldryRoundResultModalProps) => {
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);

    const [wikipediaMetadataLoading, setWikipediaMetadataLoading] = useState(true);
    const [wikipediaMetadata, setWikipediaMetadata] = useState<any>(null);
    const componentIsMounted = useRef(true);

    const guessSuccessful = city.kod === guessedCity.kod;

    useEffect(() => {
        // cleanup function
        return () => {
            componentIsMounted.current = false;
        };
    }, []); // no extra deps => the cleanup function run this on component unmount

    useEffect(() => {
        async function fetchWikipediaMetadata() {
            try {
                const { obec, okres } = city;
                const metadata = await findMunicipalityMetadata(obec, okres);

                if (componentIsMounted.current) {
                    setWikipediaMetadata(metadata);
                    setWikipediaMetadataLoading(false);
                }
            } catch (err) {
                console.error(err);
                setWikipediaMetadataLoading(false);
            }
        }

        fetchWikipediaMetadata();
    }, [city]);

    const wikipediaMetadataLoadingStatus = useMemo(() => {
        if (wikipediaMetadataLoading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spin />
                    <p style={{ marginLeft: '10px' }}>Hledám více informací na Wikipedi...</p>
                </div>
            );
        }
        return null;
    }, [wikipediaMetadataLoading]);

    const heraldryDescription = getHeraldryDescriptionForCity(city);
    const { round: currentRound } = currentGame;

    return (
        <Modal
            open={visible}
            footer={null}
            centered
            destroyOnClose
            bodyStyle={{
                ...(!guessSuccessful && {
                    backgroundColor: '#fff2f0',
                }),
            }}
            closable={false}
        >
            {guessSuccessful && <ConfettiAnimation />}
            <div className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <h2>
                            Kolo: {currentRound}/{TOTAL_ROUNDS_MAX}
                        </h2>
                        <h3>{guessSuccessful ? 'Správně!' : `${guessedCity.obec} není správná odpověď :(`}</h3>
                    </div>
                ) : null}
                <div className="result-modal-container-more-info">
                    <h3>Správná odpověď</h3>
                    <div className="result-modal-container-more-info-city">
                        <div
                            style={{
                                width: '100%',
                            }}
                        >
                            <h4 className="result-modal-container-more-info-city-headline">{city.obec}</h4>
                            <p>
                                okres {city.okres}, {city.kraj}
                            </p>
                        </div>
                        <div className="result-modal-container-more-info-city-right">
                            <img
                                id="result-city-emblem"
                                src={city.coatOfArms}
                                alt={`Znak obce ${city.obec}`}
                                className="result-city-emblem"
                            />
                        </div>
                    </div>
                    <div>
                        {heraldryDescription ? (
                            <p>
                                <b>{heraldryDescription}</b>
                            </p>
                        ) : null}
                        {wikipediaMetadataLoadingStatus}
                        {wikipediaMetadata?.summary && (
                            <div className="result-modal-container-more-info-city-left-summary">
                                {wikipediaMetadata.summary}
                            </div>
                        )}
                        {/* wikipediaMetadata?.history && (
                                <div className="result-modal-container-more-info-city-left-summary">
                                    {getHistoryIntro(wikipediaMetadata.history)}
                                </div>
                            ) */}
                    </div>
                    {wikipediaMetadata && (
                        <div className="result-modal-container-more-info-wiki">
                            <a href={wikipediaMetadata.wikipediaUrl} target="_blank" rel="noopener noreferrer">
                                <p>Více informací u zdroje (Wikipedia)</p>
                            </a>
                        </div>
                    )}
                </div>
                <div className="result-modal-button">
                    <HeraldryNextRoundButton onGuessNextRound={onGuessNextRound} onShowResult={onShowResult} />
                </div>
            </div>
        </Modal>
    );
};
