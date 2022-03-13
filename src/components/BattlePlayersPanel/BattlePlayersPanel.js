import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { decryptEmail, findUserFromBattleByRandomTokenId } from '../../util';
import BattlePlayersList from '../BattlePlayersList';
import BattleSettings from '../BattleSettings';

const BattlePlayersPanel = () => {
    const randomUserToken = useGetRandomUserToken();
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const [myPlayer, setMyPlayer] = useState();
    const [battleCanBeStarted, setBattleCanBeStarted] = useState(false);

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
            <div className="battle-users-container">
                <BattlePlayersList myPlayer={myPlayer} battleCanBeStarted={battleCanBeStarted} />
                <div className="warning-msg">
                    <p>
                        Toto je
                        {' '}
                        <b>beta verze</b>
                        {' '}
                        a stále probíhá její testování. V případě že něco nefunguje, často
                        pomůže refresh stránky.
                    </p>
                    <p>
                        Pokud něco nefunguje
                        {' '}
                        <b>hodně</b>
                        {' '}
                        nebo vůbec, hlaště mi to prosím do
                        {' '}
                        <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>mailu</a>
                        {' '}
                        :).
                    </p>
                </div>
                <BattleSettings />
            </div>
        </>
    );
};

export default BattlePlayersPanel;
