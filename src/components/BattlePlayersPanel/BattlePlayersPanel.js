import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useSMapResize from '../../hooks/useSMapResize';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findUserFromBattleByRandomTokenId } from '../../util';
import BattlePlayersList from '../BattlePlayersList';
import BattleSettings from '../BattleSettings';

const BattlePlayersPanel = () => {
    const randomUserToken = useGetRandomUserToken();
    const { width } = useSMapResize();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const usersSidebarWidth = width / 6;

    useEffect(() => {
        // find my user
        setMyPlayer(findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    return (
        <>
            <div className="battle-users-container" style={{ width: usersSidebarWidth }}>
                {!currentBattleInfo?.isGameStarted && (
                    <>
                        <p>
                            Tuhle hru hraješ s přezdívkou
                            {' '}
                            <b>{myPlayer?.name}</b>
                            .
                        </p>
                    </>
                )}
                <BattlePlayersList />
                <BattleSettings />
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

export default BattlePlayersPanel;
