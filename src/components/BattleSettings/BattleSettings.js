import { Button, Slider, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { deleteNotPreparedBattlePlayers, updateBattle } from '../../services/firebase';

const { Title } = Typography;

const BattleSettings = () => {
    const { battleId } = useParams();
    const randomUserToken = useGetRandomUserToken();
    const currentBattleInfo = useSelector(state => state.battle.currentBattle);

    const isBattleCreator = currentBattleInfo?.createdById === randomUserToken;
    const isGameStarted = currentBattleInfo?.isGameStarted;

    const updateBattleSettings = itemsToUpdate => {
        updateBattle(battleId, itemsToUpdate)
            .then(docRef => {})
            .catch(err => {});
    };

    if (isBattleCreator && !isGameStarted) {
        return (
            <div className="battle-settings">
                <Title level={5}>Nastavení hry:</Title>
                {currentBattleInfo.withCountdown && (
                    <>
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
                    Admin může začít hru ihned bez čekání na potvrzení zbylých hráčů. Ti, co nezvolili možnost
                    {' '}
                    <b>Připraven</b>
                    , budou ale ze hry vyhozeni.
                </p>
                <Button
                    type="primary"
                    onClick={() => {
                        deleteNotPreparedBattlePlayers(battleId)
                            .then(res => {})
                            .catch(err => {});
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
