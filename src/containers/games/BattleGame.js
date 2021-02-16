import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spin, Layout } from 'antd';

import {
    addPlayerToBattle,
    getBattleDetail,
    streamBattleDetail,
    streamBattlePlayersDetail,
    streamBattleRoundsDetail,
} from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import {
    getRandomNickname,
    findUserFromBattleByRandomTokenId,
    sortBattleRoundsById,
    countTotalPlayerScoreFromRounds,
    getIsRoundActive,
} from '../../util';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { errorNames } from '../../errors';
import {
    setCurrentBattle,
    setBattlePlayers,
    resetCurrentBattle,
    setMyUserInfoToCurrentBattle,
} from '../../redux/actions/battle';
import { resetLastPanoramaPlace } from '../../redux/actions/pano';
import { MultiplayerGameScreen } from '../MultiplayerGameScreen';
import { MAX_ALLOWED_BATTLE_PLAYERS } from '../../constants/game';

const { Content } = Layout;

export const Battle = ({ type }) => {
    useGameMenuResize();
    const dispatch = useDispatch();
    const { battleId } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [battleFromFirestore, setBattleFromFirestore] = useState();
    const [playerCapacityExhausted, setPlayerCapacityExhausted] = useState(false);
    const [battleRoundsFromFirestore, setBattleRoundsFromFirestore] = useState();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const randomUserToken = useGetRandomUserToken();

    // add player to the game
    useEffect(() => {
        if (battleId) {
            // get and store battle detail from firebase
            getBattleDetail(battleId)
                .then(battleDetail => {
                    if (battleDetail.exists) {
                        const battleData = battleDetail.data();
                        // don't add an user when the game is started

                        if (currentBattlePlayers) {
                            const isPlayerAlreadyInBattle = findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken) !== null;
                            if (randomUserToken && !battleData.isGameStarted && !isPlayerAlreadyInBattle) {
                                addPlayerToBattle(
                                    {
                                        name: getRandomNickname(),
                                        userId: randomUserToken,
                                        isReady: battleData.createdById === randomUserToken,
                                    },
                                    battleId,
                                )
                                    .then(docRef => {
                                        dispatch(resetLastPanoramaPlace());
                                    })
                                    .catch(err => {
                                        if (err.name === errorNames.maxBattleCapacityExhausted) {
                                            setPlayerCapacityExhausted(true);
                                        } else {
                                            console.error('random user token: ', randomUserToken);
                                            console.error(
                                                'random user battleData.isGameStarted: ',
                                                battleData.isGameStarted,
                                            );
                                            console.error(
                                                'random isPlayerAlreadyInBattle token: ',
                                                isPlayerAlreadyInBattle,
                                            );
                                            console.error(err.toJSON());
                                        }
                                    });
                            }
                        }
                    } else {
                        setNotFound(true);
                    }
                })
                .catch(err => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [battleId, currentBattlePlayers]);

    useEffect(() => {
        if (battleId && currentBattleInfo.battleId && currentBattleInfo.battleId !== battleId) {
            dispatch(resetCurrentBattle());
        }
    }, [battleId, currentBattleInfo, dispatch]);

    // lets setup a new game or modify existing one
    useEffect(() => {
        if (battleId && battleFromFirestore && battleRoundsFromFirestore) {
            const {
                created,
                createdById,
                withCountdown,
                countdown,
                isGameStarted,
                mode,
                round,
                currentRoundStart,
                radius,
                selectedCity,
            } = battleFromFirestore;

            const sortedBattleRounds = sortBattleRoundsById(battleRoundsFromFirestore).map(roundDetail => {
                return {
                    ...roundDetail,
                    isRoundActive: getIsRoundActive(roundDetail.guessedTime, currentBattleInfo.countdown),
                };
            });

            dispatch(
                setCurrentBattle({
                    dateCreatedInSeconds: created?.seconds,
                    battleId,
                    createdById,
                    mode,
                    withCountdown,
                    countdown,
                    isGameStarted,
                    round,
                    rounds: sortedBattleRounds,
                    currentRoundStart,
                    radius,
                    selectedCity,
                }),
            );
        }
    }, [battleFromFirestore, battleRoundsFromFirestore, battleId, dispatch, currentBattleInfo.countdown]);

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

                const myUser = findUserFromBattleByRandomTokenId(updatedBattlePlayers, randomUserToken);
                if (myUser) {
                    const { name, documentId } = myUser;
                    dispatch(
                        setMyUserInfoToCurrentBattle({
                            myNickname: currentBattleInfo.myNickname ? currentBattleInfo.myNickname : name, // use the name from redux store if exists
                            myTotalScore: countTotalPlayerScoreFromRounds(myUser),
                            myDocumentId: documentId,
                        }),
                    );
                }
            },
            error: err => {},
        });
        return unsubscribe;
    }, [battleId, randomUserToken, dispatch, currentBattleInfo.myNickname]);

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

    const checkLocalUserForbidden = () => {
        if (currentBattlePlayers && currentBattlePlayers.length && randomUserToken) {
            const localUserMemberOfGameArray = currentBattlePlayers.filter(player => player.userId === randomUserToken);
            if (currentBattleInfo.isGameStarted && localUserMemberOfGameArray.length === 0) {
                return true;
            }
        }
        return false;
    };

    if (notFound || checkLocalUserForbidden()) {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }

    if (playerCapacityExhausted) {
        return (
            <Content>
                Sem už se bohužel nevejdeš. Maximální počet hráčů, kteří mohou proti sobě hrát, je
                {' '}
                {MAX_ALLOWED_BATTLE_PLAYERS}
                .
            </Content>
        );
    }

    if (!battleFromFirestore) {
        return <Spin size="large" />;
    }

    return (
        <>
            <Content>
                <MultiplayerGameScreen mode={currentBattleInfo.mode} isGameStarted={currentBattleInfo.isGameStarted} />
            </Content>
        </>
    );
};
