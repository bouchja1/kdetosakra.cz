import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Layout, notification } from 'antd';

import {
    addPlayerToBattle,
    getBattleDetail,
    getBattlePlayers,
    getBattlePlayerBattleRounds,
    streamBattleDetail,
    streamBattlePlayersDetail,
    streamBattleRoundsDetail,
    updateBattle,
} from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import {
    getRandomNickname, findMyUserFromBattle, findLastGuessedRound, sortBattleRoundsById
} from '../../util';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import {
    setCurrentBattle,
    setBattlePlayers,
    resetCurrentBattle,
    setMyUserInfoToCurrentBattle,
    setRoundsToCurrentBattle,
    setCurrentBattleRound,
    incrementMyTotalScore,
    setMyTotalScore,
} from '../../redux/actions/battle';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const Battle = () => {
    useGameMenuResize();
    const dispatch = useDispatch();
    const { battleId } = useParams();
    const [api] = notification.useNotification();
    const [notFound, setNotFound] = useState(false);
    const [battleFromFirestore, setBattleFromFirestore] = useState();
    const [battlePlayersFromFirestore, setBattlePlayersFromFirestore] = useState();
    const [battleRoundsFromFirestore, setBattleRoundsFromFirestore] = useState();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const randomUserToken = useGetRandomUserToken();
    const [localUserForbidden, setLocalUserForbidden] = useState(false);

    const showFirstGuessNotification = (name, countdown) => {
        /*
                // do not show this to me if I have guessed this first
        if (withCountdown && show && guessedById !== randomUserToken) {
            showFirstGuessNotification(name, countdown);
        }
         */
        api.info({
            message: `<b>${name}</b> si tipnul jako první!`,
            description: `Máš ${countdown} vteřin na to udělat tvůj tip.`,
            placement: 'topRight',
            duration: 3,
        });
    };

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
                    // set total player score when battle page is loaded
                    const myUser = findMyUserFromBattle(battlePlayers, randomUserToken);
                    return getBattlePlayerBattleRounds(battleId, myUser.documentId);
                })
                .then(playerRoundsQuerySnapshot => {
                    return playerRoundsQuerySnapshot.docs.map(roundSnapshot => roundSnapshot.data());
                })
                .then(playerRounds => {
                    const totalScoreSum = playerRounds.reduce((total, round) => round.score + total, 0);
                    dispatch(setMyTotalScore(Math.round(totalScoreSum)));
                })
                .catch(err => {});
        }
    }, [battleId]);

    useEffect(() => {
        if (currentBattleInfo && currentBattleInfo.battleId !== battleId) {
            dispatch(resetCurrentBattle());
        }
        if (currentBattlePlayers && currentBattlePlayers.length && randomUserToken) {
            const localUserMemberOfGameArray = currentBattlePlayers.filter(player => player.userId === randomUserToken);
            if (currentBattleInfo.isGameStarted && !localUserMemberOfGameArray.length) {
                setLocalUserForbidden(!localUserMemberOfGameArray.length);
                dispatch(resetCurrentBattle());
            }
        }
    }, [currentBattleInfo, currentBattlePlayers, randomUserToken]);

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
        if (battleFromFirestore) {
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

            // sum meho score

            dispatch(
                setCurrentBattle({
                    dateCreatedInSeconds: created?.seconds,
                    battleId,
                    createdById: createdBy,
                    mode,
                    isGameFinishedSuccessfully,
                    withCountdown,
                    countdown,
                    isGameStarted,
                }),
            );
        }
    }, [battleFromFirestore]);

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

    useEffect(() => {
        if (battleFromFirestore && battleRoundsFromFirestore) {
            // TODO tady udelat ten odpocet a zaznamenani, ze se neco stalo (asi do reduxu a pak s tim muzu odkudkoliv pracovat)
            console.log('PORAAAADIII 2: ', battleRoundsFromFirestore);
            const currentBattleRound = battleFromFirestore.isGameStarted
                ? findLastGuessedRound(battleRoundsFromFirestore)
                : 0;
            const sortedBattleRounds = sortBattleRoundsById(battleRoundsFromFirestore);
            console.log('NOOOOO currentBattleRound: ', sortedBattleRounds);
            const currentRound = sortedBattleRounds[currentBattleRound - 1];
            console.log('JOOOOO currentRound: ', currentRound);
            dispatch(setCurrentBattleRound(currentBattleRound));
            dispatch(setRoundsToCurrentBattle(sortedBattleRounds));
            // kdybych chtel delat notifiakce - TODO pokud prijde firstGuessm, zkontrolovat, zda je v ramci meho aktualniho kola a zda jsem ho jiz videl nebo ne, pak dispatch
        }
    }, [battleFromFirestore, battleRoundsFromFirestore]);

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
                console.log('PORAAAADIII 1');
                setBattleRoundsFromFirestore(updatedBattleRounds);
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, setBattleRoundsFromFirestore]);

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

    // console.log('current battle info: ', currentBattleInfo);

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
