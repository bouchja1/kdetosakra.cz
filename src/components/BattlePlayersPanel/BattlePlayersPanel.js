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
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [myPlayer, setMyPlayer] = useState();
    const [battleCanBeStarted, setBattleCanBeStarted] = useState(false);

    const usersSidebarWidth = width / 6;

    useEffect(() => {
        // find my user
        if (currentBattlePlayers !== null) {
            setMyPlayer(findUserFromBattleByRandomTokenId(currentBattlePlayers, randomUserToken));
        }
    }, [currentBattlePlayers, randomUserToken]);

    // all players are ready! lets start the game - multiplayer game is being started!
    useEffect(() => {
        const { isGameStarted } = currentBattleInfo;
        if (currentBattlePlayers !== null) {
            const readyPlayers = currentBattlePlayers.filter(player => player.isReady);
            if (
                !isGameStarted
                && currentBattlePlayers.length > 1
                && readyPlayers.length === currentBattlePlayers.length
            ) {
                setBattleCanBeStarted(true);
            }
        }
    }, [currentBattlePlayers, currentBattleInfo]);

    return (
        <>
            <div className="battle-users-container" style={{ width: usersSidebarWidth }}>
                <BattlePlayersList myPlayer={myPlayer} battleCanBeStarted={battleCanBeStarted} />
                <BattleSettings />
            </div>
        </>
    );
};

export default BattlePlayersPanel;
