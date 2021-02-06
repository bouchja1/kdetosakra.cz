import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Layout, Button } from 'antd';
import {
    addPlayerToBattle,
    getBattleDetail,
    streamBattleDetail,
    streamBattlePlayersDetail,
    updateBattlePlayer,
    updateBattle,
} from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { setCurrentBattle, setBattlePlayers } from '../../redux/actions/battle';
import { GameScreen } from '../GameScreen';

const { Content } = Layout;

export const Battle = () => {
    useGameMenuResize();
    const dispatch = useDispatch();
    const { battleId } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [battleFromFirestore, setBattleFromFirestore] = useState();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const randomUserToken = useGetRandomUserToken();

    useEffect(() => {
        if (battleFromFirestore) {
            const {
                created,
                createdBy,
                rounds,
                isGameFinishedSuccessfully,
                isGameActive,
                isGameStarted,
                mode,
            } = battleFromFirestore;

            // TODO najit posledni kolo, kt. je aktivni

            dispatch(
                setCurrentBattle({
                    dateCreatedInSeconds: created?.seconds,
                    battleId,
                    createdById: createdBy,
                    mode,
                    round: rounds.length ? 42 : 0,
                    rounds,
                    totalScore: 0, // TODO vytahnout hracovo skore z kolekce
                    isGameFinishedSuccessfully,
                    isGameActive,
                    isGameStarted,
                }),
            );
        }
    }, [battleFromFirestore]);

    useEffect(() => {
        if (battleId) {
            getBattleDetail(battleId)
                .then(battleDetail => {
                    console.log('NOOO: ', battleDetail);
                    if (battleDetail.exists) {
                        const battleData = battleDetail.data();
                        // TODO check if I am already added to this group
                        console.log('battleData: ', battleData);

                        if (randomUserToken) {
                            addPlayerToBattle(
                                {
                                    name: randomUserToken,
                                    userId: randomUserToken,
                                },
                                battleId,
                            )
                                .then(docRef => {
                                    console.log('*************HRAAAAAAC BYL PRIDAN *************', docRef);
                                })
                                .catch(err => {
                                    console.log('ERR :( :(: ', err);
                                });
                        }
                        setBattleFromFirestore(battleData);
                    } else {
                        setNotFound(true);
                    }
                })
                .catch(err => {
                    console.log('EEEE: ', err);
                });
        }
    }, [battleId]);

    // Use an effect hook to subscribe to the battle players detail
    // automatically unsubscribe when the component unmounts.
    useEffect(() => {
        const unsubscribe = streamBattlePlayersDetail(battleId, {
            next: querySnapshot => {
                console.log('querySnapshot: ', querySnapshot);
                const updatedBattlePlayers = querySnapshot.docs.map(docSnapshot => docSnapshot.data());
                console.log('NOOOO bude updated????????????: ', updatedBattlePlayers);
                dispatch(setBattlePlayers(updatedBattlePlayers));
            },
            error: err => {
                console.log('EEEEROR: ', err);
            },
        });
        return unsubscribe;
    }, [battleId, setBattlePlayers]);

    useEffect(() => {
        const unsubscribe = streamBattleDetail(battleId, {
            next: querySnapshot => {
                const updatedBattle = querySnapshot.data();
                setBattleFromFirestore(updatedBattle);
            },
            error: err => {
                console.log('EEEEROR streamBattleDetail: ', err);
            },
        });
        return unsubscribe;
    }, [battleId, setBattleFromFirestore]);

    console.log('current battle info: ', currentBattleInfo);

    if (!currentBattleInfo && notFound) {
        return <>Battle was not found</>;
    }

    if (currentBattleInfo?.isGameStarted) {
        return (
            <Redirect
                to={{
                    pathname: '/battle',
                    state: {
                        battleId,
                    },
                }}
            />
        );
    }

    return (
        <>
            <Content>
                <GameScreen mode={currentBattleInfo.mode} isGameStarted={currentBattleInfo.isGameStarted} isBattle />
            </Content>
            {currentBattleInfo.createdBy === randomUserToken && (
                <Button
                    type="primary"
                    onClick={() => {
                        updateBattle(battleId, { isGameStarted: false })
                            .then(docRef => {
                                console.log('*************HRA BYL UPRAVENNNNNNNNAAA *************', docRef);
                            })
                            .catch(err => {
                                console.log('ERR hra uprava :( :(: ', err);
                            });
                    }}
                >
                    Začít hru bez čekání na všechny hráče
                </Button>
            )}
        </>
    );
};
