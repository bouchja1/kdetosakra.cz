import { Button, Progress, Tabs } from 'antd';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { DonateContent } from '../../components/DonateContent';
import ResultSMap from '../../components/ResultSMap';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { sortPlayersByHighestScore } from '../../util';
import { RoundsSummary } from './RoundsSummary';

const { TabPane } = Tabs;

export const BattleResult = () => {
    const randomUserToken = useGetRandomUserToken();
    const lastResult = useSelector(state => state.result);

    const [activePlayerStructure, setActivePlayerStructure] = useState();

    const { mode, city, radius, players } = lastResult;

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
    }, [randomUserToken, players]);

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

    if (players) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Celková průměrná přesnost</h3>
                            {activePlayerStructure && (
                                <Progress
                                    type="circle"
                                    percent={Math.round(activePlayerStructure.score / TOTAL_ROUNDS_MAX)}
                                />
                            )}
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Pořadí a vzdálenost od hádaného místa (km)</h3>
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
                                                    if (round) {
                                                        return (
                                                            <RoundsSummary
                                                                index={index}
                                                                roundScore={round.score}
                                                                roundDistance={round.distance}
                                                                roundCity={round?.currentCity}
                                                            />
                                                        );
                                                    }
                                                    return (
                                                        <RoundsSummary
                                                            index={index}
                                                            roundScore={0}
                                                            roundDistance={-1}
                                                            roundCity={round?.currentCity}
                                                        />
                                                    );
                                                })}
                                            </TabPane>
                                        );
                                    })}
                                </Tabs>
                            </div>
                        </div>
                        <div className="result-container-item" />
                    </div>
                </div>
                <div className="result-container-item" style={{ marginBottom: '25px' }}>
                    <Button size="large" type="primary">
                        <Link
                            to={{
                                pathname: '/',
                            }}
                        >
                            Zpět na výběr herního módu
                        </Link>
                    </Button>
                </div>
                <DonateContent marginBottom={25} withDonate />
                {activePlayerStructure && (
                    <ResultSMap
                        guessedPoints={activePlayerStructure.guessedPoints}
                        mode={mode}
                        city={city}
                        radius={radius}
                    />
                )}
            </>
        );
    }
    return <Redirect to={{ pathname: '/' }} />;
};
