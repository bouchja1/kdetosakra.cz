import React, { useEffect, useState } from 'react';
import { Button, Spin, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { updateBattlePlayer } from '../../services/firebase';
import { findMyUserFromBattle } from '../../util';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const { Title } = Typography;

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
