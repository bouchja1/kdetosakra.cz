import React, { useEffect, useState } from 'react';
import {
    Button, Spin, Typography, Progress
} from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { addRoundBatchToBattleRounds, updateBattlePlayer } from '../../services/firebase';
import {
    findMyUserFromBattle,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    sortPlayersByHighestScore,
} from '../../util';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import gameModes from '../../enums/modes';

const { Title } = Typography;

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
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    useEffect(() => {
        // find my user
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

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
                            <div className="battle-players-detail-player-result--status">
                                <Spin size="small" />
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
            const { name } = player;
            const currentPlayerRound = player[`round${round}`];
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div className="battle-players-detail--name">{name}</div>
                        <div className="battle-players-detail--status">
                            {currentPlayerRound?.score ? (
                                <CheckCircleTwoTone twoToneColor="#52c41a" />
                            ) : (
                                <Spin size="small" />
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
        console.log('NOOOOOOOOOOOOOO: ', currentBattlePlayers);
        const players = currentBattlePlayers ?? [];
        return players.map((player, i) => {
            const { name, isReady } = player;
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div className="battle-players-detail--name">{name}</div>
                        <div className="battle-players-detail--status">
                            {isReady ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <Spin size="small" />}
                        </div>
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
                    <Button
                        disabled={myPlayer?.isReady}
                        type="primary"
                        onClick={() => {
                            // if the user is a battle creator, he will generate rounds here
                            if (currentBattleInfo.createdById === randomUserToken) {
                                generateRounds(currentBattleInfo.mode, currentBattleInfo.battleId);
                            }
                            updateBattlePlayer(battleId, randomUserToken, { isReady: true })
                                .then(docRef => {})
                                .catch(err => {});
                        }}
                    >
                        Připraven
                    </Button>
                    <p style={{ marginTop: '10px' }}>
                        Hra začíná, až všichni hráči zvolí možnost
                        {' '}
                        <b>Připraven</b>
                        .
                    </p>
                </>
            )}
        </>
    );
};

export default BattlePlayersList;
