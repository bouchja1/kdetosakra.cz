import React, {
    useEffect, useMemo, useState, useRef
} from 'react';
import {
    Button, Modal, Progress, Spin
} from 'antd';
import { useSelector } from 'react-redux';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { findMunicipalityMetadata } from '../../services/wikipedia';
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

    const [wikipediaMetadataLoading, setWikipediaMetadataLoading] = useState(true);
    const [wikipediaMetadata, setWikipediaMetadata] = useState(null);
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
                const { obec, okres } = guessedRandomPlace;
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

        if (guessedRandomPlace && roundGuessedDistance) {
            fetchWikipediaMetadata();
        }
    }, [guessedRandomPlace, roundGuessedDistance]);

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
    }, [wikipediaMetadata, wikipediaMetadataLoading]);

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
            centered
            destroyOnClose
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
                            {Math.round(totalRoundScore)}
                        </div>
                    ) : null}
                </div>
                {guessedRandomPlace && roundGuessedDistance ? (
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
                                <h4 className="result-modal-container-more-info-city-headline">
                                    {guessedRandomPlace.obec}
                                </h4>
                                <p>
                                    okres
                                    {' '}
                                    {guessedRandomPlace.okres}
                                    ,
                                    {' '}
                                    {guessedRandomPlace.kraj}
                                </p>
                                {wikipediaMetadataLoadingStatus}
                                {wikipediaMetadata?.summary && (
                                    <div className="result-modal-container-more-info-city-left-summary">
                                        {wikipediaMetadata.summary}
                                    </div>
                                )}
                            </div>
                            {wikipediaMetadata?.emblem && (
                                <div className="result-modal-container-more-info-city-right">
                                    <img
                                        id="result-city-emblem"
                                        src={wikipediaMetadata.emblem}
                                        alt={`Znak obce ${guessedRandomPlace.obec}`}
                                        className="result-city-emblem"
                                    />
                                </div>
                            )}
                        </div>
                        {wikipediaMetadata && (
                            <div className="result-modal-container-more-info-wiki">
                                <a href={wikipediaMetadata.wikipediaUrl} target="_blank" rel="noopener noreferrer">
                                    <p>Více informací u zdroje (Wikipedia)</p>
                                </a>
                            </div>
                        )}
                    </div>
                ) : null}
                <div className="result-modal-button">
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            closeModal(false);
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

export default RoundResultModal;
