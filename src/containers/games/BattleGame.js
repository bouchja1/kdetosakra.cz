import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Layout } from 'antd';

import {
    addPlayerToBattle,
    getBattleDetail,
    getBattlePlayers,
    streamBattleDetail,
    streamBattlePlayersDetail,
    updateBattle,
} from '../../services/firebase';
import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import {
    getRandomCzechPlace,
    getRandomNickname,
    generateRandomRadius,
    generatePlaceInRadius,
    findMyUserFromBattle,
    findLastGuessedRound,
    sortBattleRoundsById,
} from '../../util';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import {
    setCurrentBattle,
    setBattlePlayers,
    resetCurrentBattle,
    setMyUserInfoToCurrentBattle,
} from '../../redux/actions/battle';
import { GameScreen } from '../GameScreen';
import gameModes from '../../enums/modes';

const { Content } = Layout;

const checkGenerateRounds = (isGameStarted, mode, battleId) => {
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

    if (isGameStarted) {
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
    }

    if (generatedRounds.length) {
        updateBattle(battleId, { rounds: generatedRounds })
            .then(docRef => {})
            .catch(err => {});
    }

    return generatedRounds;
};

export const Battle = () => {
    useGameMenuResize();
    const dispatch = useDispatch();
    const { battleId } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [battleFromFirestore, setBattleFromFirestore] = useState();
    const [battlePlayersFromFirestore, setBattlePlayersFromFirestore] = useState();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const randomUserToken = useGetRandomUserToken();
    const [localUserForbidden, setLocalUserForbidden] = useState(false);

    useEffect(() => {
        if (currentBattleInfo?.battleId !== battleId) {
            dispatch(resetCurrentBattle());
        }
        if (currentBattlePlayers.length) {
            const localUserMemberOfGameArray = currentBattlePlayers.filter(player => player.userId === randomUserToken);
            setLocalUserForbidden(!localUserMemberOfGameArray.length);
        }
    }, []);

    // multiplayer game is being started!
    useEffect(() => {
        const { isGameStarted } = currentBattleInfo;
        const readyPlayers = currentBattlePlayers.filter(player => player.isReady);
        if (!isGameStarted && currentBattlePlayers.length > 1 && readyPlayers.length === currentBattlePlayers.length) {
            // all players are ready! lets start the game
            updateBattle(battleId, { isGameStarted: true })
                .then(docRef => {})
                .catch(err => {});
        }
    }, [currentBattlePlayers, currentBattleInfo]);

    // lets setup a new game or modify existing one
    useEffect(() => {
        if (battleFromFirestore) {
            const {
                created,
                createdBy,
                rounds,
                isGameFinishedSuccessfully,
                withCountdown,
                countdown,
                isGameActive,
                isGameStarted,
                mode,
                radius,
                selectedCity,
            } = battleFromFirestore;

            // if rounds are empty, this is a new game
            const roundsToStore = rounds.length ? rounds : checkGenerateRounds(isGameStarted, mode, battleId);
            const lastGuessedRound = findLastGuessedRound(roundsToStore);

            // sum meho score

            dispatch(
                setCurrentBattle({
                    dateCreatedInSeconds: created?.seconds,
                    battleId,
                    createdById: createdBy,
                    mode,
                    round: lastGuessedRound,
                    rounds: sortBattleRoundsById(roundsToStore),
                    isGameFinishedSuccessfully,
                    withCountdown,
                    countdown,
                    isGameActive,
                    isGameStarted,
                }),
            );
        }
    }, [battleFromFirestore]);

    useEffect(() => {
        if (battlePlayersFromFirestore) {
            dispatch(setBattlePlayers(battlePlayersFromFirestore));
            const myUser = findMyUserFromBattle(battlePlayersFromFirestore, randomUserToken);
            if (myUser) {
                const { name, totalScore } = myUser;
                dispatch(setMyUserInfoToCurrentBattle({ myNickname: name, myTotalScore: totalScore }));
            }
        }
    }, [battlePlayersFromFirestore]);

    useEffect(() => {
        if (battleId) {
            // get and store battle detail from firebase
            getBattleDetail(battleId)
                .then(battleDetail => {
                    if (battleDetail.exists) {
                        const battleData = battleDetail.data();
                        // don't add an user when the game is started
                        if (randomUserToken && !battleData.isGameStarted) {
                            addPlayerToBattle(
                                {
                                    name: getRandomNickname(),
                                    userId: randomUserToken,
                                },
                                battleId,
                            )
                                .then(docRef => {})
                                .catch(err => {
                                    console.log('Err: ', err);
                                });
                        }
                        setBattleFromFirestore(battleData);
                    } else {
                        setNotFound(true);
                    }
                })
                .catch(err => {});

            // get and store battle players from firebase
            getBattlePlayers(battleId)
                .then(querySnapshot => querySnapshot.docs.map(x => x.data()))
                .then(battlePlayers => {
                    setBattlePlayersFromFirestore(battlePlayers);
                })
                .catch(err => {});
        }
    }, [battleId]);

    // Use an effect hook to subscribe to the battle players detail
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
        const unsubscribe = streamBattlePlayersDetail(battleId, {
            next: querySnapshot => {
                const updatedBattlePlayers = querySnapshot.docs.map(docSnapshot => docSnapshot.data());
                dispatch(setBattlePlayers(updatedBattlePlayers));
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, setBattlePlayers]);

    useEffect(() => {
        const unsubscribe = streamBattleDetail(battleId, {
            next: querySnapshot => {
                const updatedBattle = querySnapshot.data();
                setBattleFromFirestore(updatedBattle);
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, setBattleFromFirestore]);

    console.log('current battle info: ', currentBattleInfo);

    if (notFound || localUserForbidden) {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }

    if (!battleFromFirestore) {
        return <Spin size="large" />;
    }

    return (
        <>
            <Content>
                <GameScreen mode={currentBattleInfo.mode} isGameStarted={currentBattleInfo.isGameStarted} isBattle />
            </Content>
        </>
    );
};
