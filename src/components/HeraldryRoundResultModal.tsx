import { Button, Modal, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { TOTAL_ROUNDS_MAX } from '../constants/game';
import { findMunicipalityMetadata } from '../services/wikipedia.mjs';
import { CzechCity } from '../types/places';

interface HeraldryRoundResultModalProps {
    visible: boolean;
    closeModal: () => void;
    totalRoundScore: number;
    city: CzechCity;
}

export const HeraldryRoundResultModal = ({
    closeModal,
    visible,
    totalRoundScore,
    city,
}: HeraldryRoundResultModalProps) => {
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);

    const [wikipediaMetadataLoading, setWikipediaMetadataLoading] = useState(true);
    const [wikipediaMetadata, setWikipediaMetadata] = useState<any>(null);
    const componentIsMounted = useRef(true);

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

    const { round: currentRound } = currentGame;

    return (
        <Modal
            open={visible}
            style={{ top: 20 }}
            onOk={closeModal}
            onCancel={closeModal}
            footer={null}
            centered
            destroyOnClose
        >
            <div className="result-modal-container">
                {currentRound > 0 ? (
                    <div className="result-modal-container-item">
                        <h2>
                            Kolo: {currentRound}/{TOTAL_ROUNDS_MAX}
                        </h2>
                        <p>TODO více info</p>
                    </div>
                ) : null}
                <div className="result-modal-container-row">
                    {totalRoundScore >= 0 ? (
                        <div className="result-modal-container-item">
                            <h4>Průběžný počet bodů</h4>
                            {Math.round(totalRoundScore)}
                        </div>
                    ) : null}
                </div>
                <div className="result-modal-container-more-info">
                    <h3>Bližší informace</h3>
                    <div className="result-modal-container-more-info-city">
                        <div
                            style={
                                wikipediaMetadata?.emblem
                                    ? {
                                          width: '70%',
                                          paddingRight: '10px',
                                      }
                                    : {
                                          width: '100%',
                                      }
                            }
                        >
                            <h4 className="result-modal-container-more-info-city-headline">{city.obec}</h4>
                            <p>
                                okres {city.okres}, {city.kraj}
                            </p>
                        </div>
                        {wikipediaMetadata?.emblem && (
                            <div className="result-modal-container-more-info-city-right">
                                <img
                                    id="result-city-emblem"
                                    src={wikipediaMetadata.emblem}
                                    alt={`Znak obce ${city.obec}`}
                                    className="result-city-emblem"
                                />
                            </div>
                        )}
                    </div>
                    <div>
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
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            closeModal();
                            setWikipediaMetadata(null);
                            setWikipediaMetadataLoading(true);
                        }}
                    >
                        Zavřít
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
