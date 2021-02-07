import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Layout } from 'antd';

import {
    addPlayerToBattle,
    addRoundBatchToBattleRounds,
    getBattleDetail,
    getBattlePlayers,
    getBattleRounds,
    streamBattleDetail,
    streamBattlePlayersDetail,
    streamBattleRoundsDetail,
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
    setRoundsToCurrentBattle,
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
        console.log('--------------------------------------------------------: ', generatedRounds.length);
        console.log('generatedRounds: ', generatedRounds);
        addRoundBatchToBattleRounds(battleId, generatedRounds)
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
    const [battleRoundsFromFirestore, setBattleRoundsFromFirestore] = useState();
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
            updateBattle(battleId, { isGameStarted: true, round: 1 })
                .then(docRef => {})
                .catch(err => {});
        }
    }, [currentBattlePlayers, currentBattleInfo]);

    // lets setup a new game or modify existing one
    useEffect(() => {
        if (battleFromFirestore && battleRoundsFromFirestore) {
            const {
                created,
                createdBy,
                isGameFinishedSuccessfully,
                withCountdown,
                countdown,
                isGameStarted,
                mode,
                radius,
                selectedCity,
            } = battleFromFirestore;

            console.log('LALALALALALALAAAAAAAAA: ', battleRoundsFromFirestore);

            // if rounds are empty, this is a new game
            const roundsToStore = battleRoundsFromFirestore.length
                ? battleRoundsFromFirestore
                : checkGenerateRounds(isGameStarted, mode, battleId);

            // sum meho score

            dispatch(
                setCurrentBattle({
                    dateCreatedInSeconds: created?.seconds,
                    battleId,
                    createdById: createdBy,
                    mode,
                    round: isGameStarted ? findLastGuessedRound(roundsToStore) : 0,
                    rounds: sortBattleRoundsById(roundsToStore),
                    isGameFinishedSuccessfully,
                    withCountdown,
                    countdown,
                    isGameStarted,
                }),
            );
        }
    }, [battleFromFirestore, battleRoundsFromFirestore]);

    // load my user in the beginning
    useEffect(() => {
        if (battlePlayersFromFirestore) {
            const myUser = findMyUserFromBattle(battlePlayersFromFirestore, randomUserToken);
            if (myUser) {
                const { name, totalScore, documentId } = myUser;
                dispatch(
                    setMyUserInfoToCurrentBattle({
                        myNickname: name,
                        myTotalScore: totalScore,
                        myDocumentId: documentId,
                    }),
                );
            }
        }
    }, [battlePlayersFromFirestore]);

    // load battle rounds in the beginning
    useEffect(() => {
        if (battleRoundsFromFirestore) {
            dispatch(setRoundsToCurrentBattle(battleRoundsFromFirestore));
        }
    }, [battleRoundsFromFirestore]);

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
                .then(querySnapshot => {
                    return querySnapshot.docs.map(docSnapshot => {
                        return {
                            documentId: docSnapshot.id,
                            ...docSnapshot.data(),
                        };
                    });
                })
                .then(battlePlayers => {
                    setBattlePlayersFromFirestore(battlePlayers);
                })
                .catch(err => {});

            // get and store battle players from firebase
            getBattleRounds(battleId)
                .then(querySnapshot => {
                    return querySnapshot.docs.map(docSnapshot => {
                        return {
                            documentId: docSnapshot.id,
                            ...docSnapshot.data(),
                        };
                    });
                })
                .then(battleRounds => {
                    setBattleRoundsFromFirestore(battleRounds);
                })
                .catch(err => {});
        }
    }, [battleId]);

    // Use an effect hook to subscribe to the battle players detail
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
        const unsubscribe = streamBattlePlayersDetail(battleId, {
            next: querySnapshot => {
                const updatedBattlePlayers = querySnapshot.docs.map(docSnapshot => {
                    return {
                        documentId: docSnapshot.id,
                        ...docSnapshot.data(),
                    };
                });
                dispatch(setBattlePlayers(updatedBattlePlayers));
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, setBattlePlayers]);

    // Use an effect hook to subscribe to the battle rounds
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
        const unsubscribe = streamBattleRoundsDetail(battleId, {
            next: querySnapshot => {
                const updatedBattleRounds = querySnapshot.docs.map(docSnapshot => {
                    return {
                        documentId: docSnapshot.id,
                        ...docSnapshot.data(),
                    };
                });
                dispatch(setRoundsToCurrentBattle(updatedBattleRounds));
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, setRoundsToCurrentBattle]);

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
