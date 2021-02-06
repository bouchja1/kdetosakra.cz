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

    useEffect(() => {
        // find my user
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    const getInvolvedBattlePlayers = () => {
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
            <Title level={5}>Hráči:</Title>
            <div className="battle-players">{battleId && getInvolvedBattlePlayers()}</div>
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
        </>
    );
};

export default BattleUsersList;
