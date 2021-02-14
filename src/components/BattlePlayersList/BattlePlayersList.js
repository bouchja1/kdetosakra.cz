import React, { useEffect, useState } from 'react';
import {
    Button, Spin, Progress, Tooltip
} from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { addRoundBatchToBattleRounds, updateBattle, updateBattlePlayer } from '../../services/firebase';
import {
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    getUnixTimestamp,
    sortPlayersByHighestScore,
} from '../../util';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import gameModes from '../../enums/modes';
import { setLastResult } from '../../redux/actions/result';

const generateRounds = currentBattleInfo => {
    const generatedRounds = [];
    const {
        mode, battleId, radius, selectedCity,
    } = currentBattleInfo;

    for (let i = 0; i < TOTAL_ROUNDS_MAX; i++) {
        switch (mode) {
            case gameModes.random: {
                const roundCity = getRandomCzechPlace();
                const roundRadius = generateRandomRadius();
                const panoramaPlace = generatePlaceInRadius(roundRadius, roundCity);
                generatedRounds.push({
                    roundId: i + 1,
                    panoramaPlace,
                    isGuessed: false,
                    guessedTime: 0,
                    city: roundCity,
                });
                break;
            }
            case gameModes.city: {
                const panoramaPlace = generatePlaceInRadius(radius, selectedCity);
                generatedRounds.push({
                    roundId: i + 1,
                    panoramaPlace,
                    isGuessed: false,
                    guessedTime: 0,
                    city: selectedCity,
                });
                break;
            }
            case gameModes.custom: {
                const panoramaPlace = generatePlaceInRadius(radius, selectedCity);
                generatedRounds.push({
                    roundId: i + 1,
                    panoramaPlace,
                    isGuessed: false,
                    guessedTime: 0,
                    city: selectedCity,
                });
                break;
            }
            default:
        }
    }

    if (generatedRounds.length) {
        addRoundBatchToBattleRounds(battleId, generatedRounds)
            .then(docRef => {})
            .catch(err => {});
    }
};

const BattlePlayersList = ({ makeStartNextBattleRound, myPlayer }) => {
    const dispatch = useDispatch();
    const randomUserToken = useGetRandomUserToken();
    const { battleId } = useParams();
    const [battleCanBeStarted, setBattleCanBeStarted] = useState(false);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const isBattleCreator = currentBattleInfo.createdById !== null && currentBattleInfo.createdById === randomUserToken;

    // all players are ready! lets start the game - multiplayer game is being started!
    useEffect(() => {
        const { isGameStarted } = currentBattleInfo;
        const readyPlayers = currentBattlePlayers.filter(player => player.isReady);
        if (!isGameStarted && currentBattlePlayers.length > 1 && readyPlayers.length === currentBattlePlayers.length) {
            setBattleCanBeStarted(true);
        }
    }, [currentBattlePlayers, currentBattleInfo]);

    const getOngoingPlayersOrder = round => {
        const players = currentBattlePlayers ?? [];
        const playersRoundResults = players.map(player => {
            const currentPlayerRound = player[`round${round}`];
            return {
                name: player.name,
                score: currentPlayerRound?.score ? Math.round(currentPlayerRound.score) : 0,
            };
        });
        const playersRoundResultsSorted = sortPlayersByHighestScore(playersRoundResults);
        return playersRoundResultsSorted.map((player, i) => {
            return (
                <>
                    <div key={i} className="battle-players-detail-result">
                        <div className="battle-players-detail-player-result">
                            <div
                                className={`battle-players-detail-player-result--name ${
                                    myPlayer?.userId === player.userId ? 'highlighted' : ''
                                }`}
                            >
                                {player.name}
                            </div>
                        </div>
                        <div className="battle-players-detail--status">
                            <Progress percent={player.score} />
                        </div>
                    </div>
                </>
            );
        });
    };

    const getGuessingBattlePlayers = round => {
        const players = currentBattlePlayers ?? [];
        return players.map((player, i) => {
            const { name, userId } = player;
            const currentPlayerRound = player[`round${round}`];
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div
                            className={`battle-players-detail--name ${
                                myPlayer?.userId === userId ? 'highlighted' : ''
                            }`}
                        >
                            {name}
                        </div>
                        <div className="battle-players-detail--status">
                            {currentPlayerRound?.score ? (
                                <Tooltip title="Hráč umístil tip">
                                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                                </Tooltip>
                            ) : (
                                <Tooltip title="Hráč hádá místo">
                                    <Spin size="small" />
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </>
            );
        });
    };

    const getManagedRoundButton = round => {
        if (round >= TOTAL_ROUNDS_MAX) {
            return (
                <Button
                    type="primary"
                    onClick={() => {
                        dispatch(
                            setLastResult({
                                players: currentBattleInfo.players,
                                round: currentBattleInfo.round,
                                rounds: currentBattleInfo.rounds,
                                totalScore: currentBattleInfo.myTotalScore,
                                mode: currentBattleInfo.mode,
                                city: currentBattleInfo.selectedCity,
                                radius: currentBattleInfo.radius,
                                isBattle: true,
                            }),
                        );
                    }}
                >
                    <Link
                        to={{
                            pathname: '/vysledek',
                        }}
                    >
                        Zobrazit výsledky hry
                    </Link>
                </Button>
            );
        }

        if (isBattleCreator) {
            return (
                <>
                    <Button
                        disabled={!battleCanBeStarted}
                        type="primary"
                        onClick={() => {
                            makeStartNextBattleRound(battleId, round + 1);
                        }}
                    >
                        Začít
                        {' '}
                        {currentBattleInfo.round + 1}
                        . kolo
                    </Button>
                    <p style={{ marginTop: '10px' }}>Odstartujte jako tvůrce hry další kolo.</p>
                </>
            );
        }

        return null;
    };

    const getPlayersInActiveGame = () => {
        const { round, rounds } = currentBattleInfo;
        const currentRound = rounds[round - 1];
        const { isGuessed, isRoundActive } = currentRound;

        if (isGuessed && !isRoundActive) {
            return (
                <>
                    <h3>Pořadí kola</h3>
                    <div className="battle-players">{battleId && getOngoingPlayersOrder(round)}</div>
                    {getManagedRoundButton(round)}
                </>
            );
        }

        return (
            <>
                <h3>Hráči hádají</h3>
                <div className="battle-players">{battleId && getGuessingBattlePlayers(round)}</div>
            </>
        );
    };

    const getPlayersBeforeGameStarted = () => {
        const players = currentBattlePlayers ?? [];
        return players.map((player, i) => {
            const { name, isReady, userId } = player;
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div
                            className={`battle-players-detail--name ${
                                myPlayer?.userId === userId ? 'highlighted' : ''
                            }`}
                        >
                            {name}
                        </div>
                        {currentBattleInfo.createdById === userId ? (
                            <div className="battle-players-detail--status">
                                {currentBattleInfo.isGameStarted ? (
                                    <Tooltip title="Hráč připraven ke hře">
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Hráč se připravuje">
                                        <Spin size="small" />
                                    </Tooltip>
                                )}
                            </div>
                        ) : (
                            <div className="battle-players-detail--status">
                                {isReady ? (
                                    <Tooltip title="Hráč připraven ke hře">
                                        <CheckCircleTwoTone twoToneColor="#52c41a" />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Hráč se připravuje">
                                        <Spin size="small" />
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>
                </>
            );
        });
    };

    return (
        <>
            {' '}
            {currentBattleInfo.isGameStarted && currentBattleInfo.rounds.length ? (
                <>{getPlayersInActiveGame()}</>
            ) : (
                <>
                    <h3>Hráči</h3>
                    <div className="battle-players">{battleId && getPlayersBeforeGameStarted()}</div>
                    {isBattleCreator ? (
                        <Button
                            disabled={!battleCanBeStarted}
                            type="primary"
                            onClick={() => {
                                // if the user is a battle creator, he will generate rounds here
                                generateRounds(currentBattleInfo);
                                updateBattle(battleId, {
                                    currentRoundStart: getUnixTimestamp(new Date()),
                                    isGameStarted: true,
                                    round: 1,
                                })
                                    .then(docRef => {})
                                    .catch(err => {});
                            }}
                        >
                            Začít hru
                        </Button>
                    ) : (
                        <Button
                            disabled={myPlayer?.isReady}
                            type="primary"
                            onClick={() => {
                                updateBattlePlayer(battleId, randomUserToken, { isReady: true })
                                    .then(docRef => {})
                                    .catch(err => {});
                            }}
                        >
                            Připraven
                        </Button>
                    )}
                    <p style={{ marginTop: '10px' }}>
                        {isBattleCreator ? (
                            <>Hru můžete začít, až všichni hráči zvolí, že jsou připraveni.</>
                        ) : (
                            <>
                                Hra začíná, až všichni hráči zvolí možnost
                                {' '}
                                <b>Připraven</b>
                                .
                            </>
                        )}
                    </p>
                </>
            )}
        </>
    );
};

export default BattlePlayersList;
