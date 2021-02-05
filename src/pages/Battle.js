import React, { useState, useEffect } from 'react';
import {
    Link, Redirect, useLocation, useParams
} from 'react-router-dom';

import { Button } from 'antd';
import {
    addPlayerToBattle,
    getBattleDetail,
    streamBattleDetail,
    streamBattlePlayersDetail,
    updateBattlePlayer,
    updateBattle,
} from '../services/firebase';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import { generateRandomRadius } from '../util';
import gameModes from '../enums/modes';

export const Battle = () => {
    const location = useLocation();
    const { battleId } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [battle, setBattle] = useState();
    const randomUserToken = useGetRandomUserToken();

    const [battlePlayers, setBattlePlayers] = useState([]);

    console.log('battleId: ', battleId);

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
                        setBattle(battleData);
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
                setBattlePlayers(updatedBattlePlayers);
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
                setBattle(updatedBattle);
            },
            error: err => {
                console.log('EEEEROR streamBattleDetail: ', err);
            },
        });
        return unsubscribe;
    }, [battleId, setBattle]);

    console.log('battle: ', battle);

    const getInvolvedBattlePlayers = () => {
        return battlePlayers.map((player, i) => {
            return (
                <>
                    <div key={i}>{player.name}</div>
                    {player.userId === randomUserToken && (
                        <Button
                            disabled={player.isReady}
                            type="primary"
                            onClick={() => {
                                updateBattlePlayer(battleId, randomUserToken, { isReady: true })
                                    .then(docRef => {
                                        console.log('*************HRAAAAAAC BYL UPRAVENNNNNNNN *************', docRef);
                                    })
                                    .catch(err => {
                                        console.log('ERR :( :(: ', err);
                                    });
                            }}
                        >
                            Jsem připraven
                        </Button>
                    )}
                </>
            );
        });
    };

    console.log('BAAATLE PLAYERS: ', battlePlayers);

    if (notFound) {
        return <>Battle was not found</>;
    }

    if (battle?.isGameStarted) {
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
            Battle
            {battleId && getInvolvedBattlePlayers()}
            {battle?.createdBy === randomUserToken && (
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
