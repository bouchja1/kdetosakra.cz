import React, { useEffect, useState } from 'react';
import {
    Button, Typography, Spin, Slider, Checkbox
} from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CheckCircleTwoTone } from '@ant-design/icons';

import { updateBattle } from '../../services/firebase';
import useSMapResize from '../../hooks/useSMapResize';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { findMyUserFromBattle } from '../../util';
import BattleUsersList from '../BattleUsersList';

const { Title } = Typography;

const BattleUsers = () => {
    const randomUserToken = useGetRandomUserToken();
    const { width } = useSMapResize();
    const { battleId } = useParams();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);
    const currentBattlePlayers = useSelector(state => state.battle.currentBattle.players);
    const [myPlayer, setMyPlayer] = useState();

    const usersSidebarWidth = width / 6;

    const isBattleCreator = currentBattleInfo?.createdById === randomUserToken;

    console.log('CUUURENT BATTLE INFO: ', currentBattleInfo);

    useEffect(() => {
        // find my user
        setMyPlayer(findMyUserFromBattle(currentBattlePlayers, randomUserToken));
    }, [currentBattlePlayers]);

    const updateBattleSettings = itemsToUpdate => {
        updateBattle(battleId, itemsToUpdate)
            .then(docRef => {})
            .catch(err => {});
    };

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
            <div className="battle-users-container" style={{ width: usersSidebarWidth }}>
                {!currentBattleInfo?.isGameStarted && (
                    <>
                        {' '}
                        <p>
                            Tuhle hru hraješ s přezdívkou
                            {' '}
                            <b>{myPlayer?.name}</b>
                            .
                        </p>
                        {currentBattleInfo?.withCountdown && (
                            <p>
                                Poté, co nejrychlejší hráč umístí v daném kole svůj odhad, začíná běžet odpočet
                                {' '}
                                <b>
                                    {currentBattleInfo.countdown}
                                    {' '}
                                    sekund
                                </b>
                                {' '}
                                pro volbu ostatních.
                            </p>
                        )}
                    </>
                )}
                <BattleUsersList />
                <p style={{ marginTop: '10px' }}>
                    Hra začíná, až všichni hráči zvolí možnost
                    {' '}
                    <b>Připraven</b>
                    .
                </p>
                {isBattleCreator && !currentBattleInfo?.isGameStarted && (
                    <div className="battle-settings">
                        <Title level={5}>Nastavení hry:</Title>
                        <Checkbox
                            checked={currentBattleInfo.withCountdown}
                            onChange={e => {
                                updateBattleSettings({ withCountdown: e.target.checked });
                            }}
                        >
                            hrát s odpočtem
                        </Checkbox>
                        {currentBattleInfo.withCountdown && (
                            <>
                                <p>
                                    Odpočet času do konce hracího kola po umístění tipu nejrychlejšího hráče nastaven na
                                    {' '}
                                    <b>
                                        {currentBattleInfo.countdown}
                                        {' '}
                                        sekund
                                    </b>
                                    .
                                </p>
                                <Slider
                                    min={30}
                                    max={300}
                                    onAfterChange={value => updateBattleSettings({ countdown: value })}
                                    defaultValue={currentBattleInfo.countdown}
                                    step={15}
                                />
                            </>
                        )}
                        <p>
                            Jako tvůrce hry máte možnost začít hru bez čekání na potvrzení od zbylých hráčů. Ti, co
                            nezvolili možnost
                            {' '}
                            <b>Připraven</b>
                            , budou ale ze hry vyhozeni.
                        </p>
                        <Button
                            type="primary"
                            onClick={() => {
                                updateBattle(battleId, { isGameStarted: true })
                                    .then(docRef => {})
                                    .catch(err => {});
                            }}
                        >
                            Začít hru bez čekání
                        </Button>
                    </div>
                )}
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
