import React, { useEffect, useMemo, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Button, Progress, Typography, Tabs
} from 'antd';

import { roundToTwoDecimal, sortPlayersByHighestScore } from '../util';
import { TOTAL_ROUNDS_MAX, resultPathColors } from '../constants/game';
import useGameMenuResize from '../hooks/useGameMenuResize';
import ResultSMap from '../components/ResultSMap';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';

const { TabPane } = Tabs;
const { Title } = Typography;

export const Result = () => {
    useGameMenuResize();
    const randomUserToken = useGetRandomUserToken();
    const lastResult = useSelector(state => state.result);
    const [activePlayerStructure, setActivePlayerStructure] = useState();

    const {
        totalScore, guessedPoints, mode, city, radius, isBattle, players,
    } = lastResult;

    // FIXME: to load whole map layer when the map is minimized before
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, []);

    const finalPlayerOrderStructure = useMemo(() => {
        const playersResults = [];
        for (let i = 0; i < players.length; i++) {
            const { name, userId } = players[i];
            let score = 0;
            const playerGuessedPoints = [];
            for (let j = 0; j < TOTAL_ROUNDS_MAX; j++) {
                const roundScore = players[i][`round${j + 1}`];
                score += roundScore?.score ? Math.round(roundScore.score) : 0;
                playerGuessedPoints.push(roundScore ?? null);
            }
            playersResults.push({
                name,
                userId,
                score: Math.round(score),
                guessedPoints: playerGuessedPoints,
            });
        }
        const sortedPlayers = sortPlayersByHighestScore(playersResults);
        for (let i = 0; i < sortedPlayers.length; i++) {
            if (sortedPlayers[i].userId === randomUserToken) {
                setActivePlayerStructure(sortedPlayers[i]);
                break;
            }
        }
        return sortedPlayers;
    }, [lastResult]);

    const getMyPlayerOrderToDefaultActiveTab = () => {
        let activeTab = 0;
        for (let i = 0; i < finalPlayerOrderStructure.length; i++) {
            if (finalPlayerOrderStructure[i].userId === randomUserToken) {
                activeTab = i;
                break;
            }
        }
        return activeTab;
    };

    const playAgainButton = () => (
        <div className="result-modal-container-item" style={{ marginBottom: '25px' }}>
            <Button type="primary">
                <Link
                    to={{
                        pathname: '/',
                    }}
                >
                    Hrát znovu
                </Link>
            </Button>
        </div>
    );

    if (isBattle && players) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Celková průměrná přesnost</Title>
                            {activePlayerStructure && (
                                <Progress
                                    type="circle"
                                    percent={roundToTwoDecimal(activePlayerStructure.score / TOTAL_ROUNDS_MAX)}
                                />
                            )}
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Pořadí a vzdálenost od hádaného místa (km)</Title>
                            <div className="result-rounds-container">
                                <Tabs
                                    defaultActiveKey={`${getMyPlayerOrderToDefaultActiveTab()}`}
                                    tabPosition="left"
                                    style={{ height: 250 }}
                                    onChange={active => {
                                        setActivePlayerStructure(finalPlayerOrderStructure[active]);
                                    }}
                                >
                                    {finalPlayerOrderStructure.map((player, i) => {
                                        return (
                                            <TabPane tab={`${player.name} (${player.score} bodů)`} key={i}>
                                                {player.guessedPoints.map((round, index) => {
                                                    return (
                                                        <div key={i} className="result-round">
                                                            <div
                                                                className="result-round-color"
                                                                style={{
                                                                    backgroundColor: `${resultPathColors[index]}`,
                                                                }}
                                                            />
                                                            <div className="result-round-no">
                                                                {index + 1}
                                                                . kolo
                                                            </div>
                                                            <div className="result-round-distance">
                                                                {roundToTwoDecimal(round.distance)}
                                                                {' '}
                                                                km
                                                            </div>
                                                            <div className="result-round-score">
                                                                {Math.round(round.score)}
                                                                {' '}
                                                                bodů
                                                            </div>
                                                            {round?.currentCity?.obec
                                                                || (round?.currentCity?.kraj && (
                                                                    <div className="result-round-other-info">
                                                                        {round.currentCity.obec}
                                                                        ,
                                                                        {round.currentCity.okres}
                                                                        ,
                                                                        {' '}
                                                                        {round.currentCity.kraj}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    );
                                                })}
                                            </TabPane>
                                        );
                                    })}
                                </Tabs>
                            </div>
                        </div>
                        <div className="result-modal-container-item" />
                    </div>
                </div>
                {playAgainButton()}
                {/* FIXME - isBattle={false} - map is not shown otherwise */}
                {activePlayerStructure && (
                    <ResultSMap
                        guessedPoints={activePlayerStructure.guessedPoints}
                        isBattle={false}
                        mode={mode}
                        city={city}
                        radius={radius}
                    />
                )}
            </>
        );
    }

    if (!isBattle && guessedPoints && guessedPoints.length) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Celkové skóre</Title>
                            {totalScore}
                            {' '}
                            bodů
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Celková průměrná přesnost</Title>
                            <Progress type="circle" percent={roundToTwoDecimal(totalScore / TOTAL_ROUNDS_MAX)} />
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-modal-container-item">
                            <Title level={4}>Vzdálenost od hádaného místa (km)</Title>
                            <div className="result-rounds-container">
                                {guessedPoints.map((round, i) => {
                                    return (
                                        <div key={i} className="result-round">
                                            <div
                                                className="result-round-color"
                                                style={{ backgroundColor: `${resultPathColors[i]}` }}
                                            />
                                            <div className="result-round-no">
                                                {i + 1}
                                                . kolo
                                            </div>
                                            <div className="result-round-distance">
                                                {roundToTwoDecimal(round.distance)}
                                                {' '}
                                                km
                                            </div>
                                            <div className="result-round-score">
                                                {Math.round(round.score)}
                                                {' '}
                                                bodů
                                            </div>
                                            {round?.currentCity?.obec
                                                || (round?.currentCity?.kraj && (
                                                    <div className="result-round-other-info">
                                                        {round.currentCity.obec}
                                                        ,
                                                        {round.currentCity.okres}
                                                        ,
                                                        {' '}
                                                        {round.currentCity.kraj}
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="result-modal-container-item" />
                    </div>
                </div>
                {playAgainButton()}
                <ResultSMap guessedPoints={guessedPoints} isBattle={false} mode={mode} city={city} radius={radius} />
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};
