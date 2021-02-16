import { Button, Slider } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { generateRounds } from '../BattlePlayersList/BattlePlayersList';
import { deleteNotPreparedBattlePlayers, updateBattle, updateBattlePlayer } from '../../services/firebase';
import { getUnixTimestamp } from '../../util';

const BattleSettings = () => {
    const { battleId } = useParams();
    const randomUserToken = useGetRandomUserToken();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const isBattleCreator = currentBattleInfo?.createdById === randomUserToken;
    const isGameStarted = currentBattleInfo?.isGameStarted;

    const updateBattleSettings = async itemsToUpdate => {
        return updateBattle(battleId, itemsToUpdate)
            .then(docRef => {})
            .catch(err => {
                console.error('updateBattleSettings:', err);
            });
    };

    if (isBattleCreator && !isGameStarted) {
        return (
            <div className="battle-settings">
                <h3>Nastavení hry</h3>
                <h4>Změnit odpočet</h4>
                {currentBattleInfo.withCountdown && (
                    <>
                        <Slider
                            min={30}
                            max={300}
                            onAfterChange={async value => updateBattleSettings({ countdown: value })}
                            defaultValue={currentBattleInfo.countdown}
                            step={15}
                        />
                        <p>
                            Odpočet do konce hracího kola po tipu nejrychlejšího hráče:
                            {' '}
                            <b>
                                {currentBattleInfo.countdown}
                                {' '}
                                sekund
                            </b>
                            .
                        </p>
                    </>
                )}
                <h4>Pokročilé</h4>
                <p>
                    Lze začít bez čekání na potvrzení všech hráčů. Ti, co nezvolili možnost
                    {' '}
                    <b>Připraven</b>
                    , budou ale
                    ze hry vyhozeni.
                </p>
                <Button
                    type="primary"
                    onClick={async () => {
                        return updateBattlePlayer(battleId, randomUserToken, {
                            name: currentBattleInfo.myNickname,
                            isReady: true,
                        })
                            .then(docRef => {
                                // if the user is a battle creator, he will generate rounds here
                                return generateRounds(currentBattleInfo);
                            })
                            .then(docRef => {
                                return updateBattle(battleId, {
                                    currentRoundStart: getUnixTimestamp(new Date()),
                                    isGameStarted: true,
                                    round: 1,
                                });
                            })
                            .then(updatedBattle => {
                                return deleteNotPreparedBattlePlayers(battleId);
                            })
                            .then(deleted => {})
                            .catch(err => {
                                console.error('deleteNotPreparedBattlePlayers: ', err);
                            });
                    }}
                >
                    Začít hru ihned
                </Button>
            </div>
        );
    }

    return null;
};

export default BattleSettings;
