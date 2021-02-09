import React, { useEffect, useState } from 'react';
import { Button, Spin, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { addRoundBatchToBattleRounds, updateBattlePlayer } from '../../services/firebase';
import {
    findMyUserFromBattle,
    generatePlaceInRadius,
    generateRandomRadius,
    getRandomCzechPlace,
    mapGameModeName,
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

const BattleUsersList = () => {
    const randomUserToken = useGetRandomUserToken();
    const { battleId } = useParams();
    const [myPlayer, setMyPlayer] = useState();
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    useEffect(() => {
        // find my user
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    const getWaitingBattlePlayers = () => {
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

    const getGuessingBattlePlayers = () => {
        const players = currentBattlePlayers ?? [];
        return players.map((player, i) => {
            const { name } = player;
            const { round } = currentBattleInfo;
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

    console.log('CHACHACHA: ', currentBattlePlayers);

    return (
        <>
            {' '}
            {currentBattleInfo.isGameStarted ? (
                <>
                    <Title level={5}>Hráči hádají:</Title>
                    <div className="battle-players">{battleId && getGuessingBattlePlayers()}</div>
                </>
            ) : (
                <>
                    <Title level={5}>Hráči:</Title>
                    <div className="battle-players">{battleId && getWaitingBattlePlayers()}</div>
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

export default BattleUsersList;
