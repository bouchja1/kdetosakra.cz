import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { updateBattlePlayer } from '../../services/firebase';
import useSMapResize from '../../hooks/useSMapResize';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const { Title } = Typography;

const BattleUsers = () => {
    const randomUserToken = useGetRandomUserToken();
    const { width } = useSMapResize();
    const { battleId } = useParams();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [readyToPlay, setReadyToPlay] = useState(false);

    console.log('battleId: ', battleId);

    const usersSidebarWidth = width / 6;

    const isBattleCreator = currentBattleInfo?.createdBy === randomUserToken;

    useEffect(() => {
        // find if I am ready to play
        for (let i = 0; i < currentBattlePlayers.length; i++) {
            if (currentBattlePlayers[i].userId === randomUserToken) {
                setReadyToPlay(currentBattlePlayers[i].isReady);
                break;
            }
        }
    }, [currentBattlePlayers]);

    const getInvolvedBattlePlayers = () => {
        const players = currentBattlePlayers ?? [];
        return players.map((player, i) => {
            const { name, isReady } = player;
            return (
                <>
                    <div key={i} className="battle-players-detail">
                        <div className="battle-players-detail--name">{name}</div>
                        <div className="battle-players-detail--status">{isReady ? 'připraven' : 'NE'}</div>
                        <div className="battle-players-detail--options">options</div>
                    </div>
                </>
            );
        });
    };

    return (
        <>
            <div className="battle-users-container" style={{ width: usersSidebarWidth }}>
                <p>
                    Hra začíná, až všichni hráči zvolí možnost
                    {' '}
                    <b>Připraven</b>
                    .
                </p>
                <p>
                    Tuhle hru hraješ s přezdívkou
                    {' '}
                    <b>Sněhurka</b>
                    .
                </p>
                <Title level={5}>Hráči:</Title>
                <div className="battle-players">{battleId && getInvolvedBattlePlayers()}</div>
                <Button
                    disabled={readyToPlay}
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
                    Připraven
                </Button>
                {isBattleCreator && <Title level={5}>Nastavení hry:</Title>}
            </div>
            {/*
            <div
                className="battle-users-container--toggle"
                style={{
                    left: usersSidebarWidth,
                    height: usersSidebarWidth / 8,
                    width: usersSidebarWidth / 8,
                }}
            >
                LOL
            </div>
            */}
        </>
    );
};

export default BattleUsers;
