import React, { useEffect, useState } from 'react';
import {
    Button, Spin, Typography, Progress, Tooltip
} from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { addRoundBatchToBattleRounds, updateBattle, updateBattlePlayer } from '../../services/firebase';
import {
    findUserFromBattleByRandomTokenId,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    getUnixTimestamp,
    RADIUS_DESCRIPTION,
    sortPlayersByHighestScore,
} from '../../util';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import gameModes from '../../enums/modes';

const { Title } = Typography;

// TODO cities, custom places
const generateRounds = (mode, battleId) => {
    const generatedRounds = [];
    // pokud krajske mesto
    /*
    5x vygeneroat panorama place s radius a city vybreanym - setPanoramaPlace(generatePlaceInRadius(radius, city));
     */

    // pokud nahoda
    /*
    5x vygenervoat nahodne city city = getRandomCzechPlace();
    5x vygenervoat nahodne radius radius = generateRandomRadius();
    5x z toho vygeneroat panorama place - setPanoramaPlace(generatePlaceInRadius(radius, city));
     */

    // pokud vlastni misto
    /*
    5x vygeneroat panorama place s radius a city vybreanym - setPanoramaPlace(generatePlaceInRadius(radius, city));
     */

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
                generatedRounds.push();
                break;
            }
            case gameModes.custom: {
                generatedRounds.push();
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

const BattlePlayersList = () => {
    const randomUserToken = useGetRandomUserToken();
    const { battleId } = useParams();
    const [myPlayer, setMyPlayer] = useState();
    const [battleCanBeStarted, setBattleCanBeStarted] = useState(false);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const isBattleCreator = currentBattleInfo.createdById !== null && currentBattleInfo.createdById === randomUserToken;

    useEffect(() => {
        // find my user
        setMyPlayer(findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

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
                            <div className="battle-players-detail-player-result--name">{player.name}</div>
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
            const { name } = player;
            const currentPlayerRound = player[`round${round}`];
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div className="battle-players-detail--name">{name}</div>
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

    const getPlayersInActiveGame = () => {
        const { round, rounds } = currentBattleInfo;
        const currentRound = rounds[round - 1];
        const { isGuessed, isRoundActive } = currentRound;

        if (isGuessed && !isRoundActive) {
            return (
                <>
                    <Title level={5}>Pořadí kola:</Title>
                    <div className="battle-players">{battleId && getOngoingPlayersOrder(round)}</div>
                    {isBattleCreator && (
                        <>
                            <Button
                                disabled={!battleCanBeStarted}
                                type="primary"
                                onClick={() => {
                                    updateBattle(battleId, {
                                        currentRoundStart: getUnixTimestamp(new Date()),
                                        round: round + 1,
                                    })
                                        .then(docRef => {
                                            console.log('NOOOOOO: ', docRef);
                                        })
                                        .catch(err => {
                                            console.log('NOOOOOOO ERROR: ', err);
                                        });
                                }}
                            >
                                Začít
                                {' '}
                                {currentBattleInfo.round + 1}
                                . kolo
                            </Button>
                            <p style={{ marginTop: '10px' }}>Odstartujte jako tvůrce hry další kolo.</p>
                        </>
                    )}
                </>
            );
        }

        return (
            <>
                <Title level={5}>Hráči hádají:</Title>
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
                        <div className="battle-players-detail--name">{name}</div>
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
                    <Title level={5}>Hráči:</Title>
                    <div className="battle-players">{battleId && getPlayersBeforeGameStarted()}</div>
                    {isBattleCreator ? (
                        <Button
                            disabled={!battleCanBeStarted}
                            type="primary"
                            onClick={() => {
                                // if the user is a battle creator, he will generate rounds here
                                generateRounds(currentBattleInfo.mode, currentBattleInfo.battleId);
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
