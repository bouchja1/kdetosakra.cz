import { CopyTwoTone } from '@ant-design/icons';
import { Button, Input, Modal, RadioChangeEvent, Spin, Tooltip } from 'antd';
import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';

import discordIcon from '../../assets/images/discord.png';
import { MAX_ALLOWED_BATTLE_PLAYERS, guessResultMode } from '../../constants/game';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';
import { createBattle } from '../../services/firebase';
import { GuessResultMode } from '../GuessResultMode';

const BattleLinkModal = ({ visible, handleBattleModalVisibility, mode, radius, selectedCity, regionNutCode }) => {
    const randomUserToken = useGetRandomUserToken();
    const [resultModeValue, setResultModeValue] = useState(guessResultMode.end);
    const [battleLink, setBattleLink] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    const [generateLinkInProgress, setGenerateLinkInProgress] = useState(false);

    const handleCancel = () => {
        handleBattleModalVisibility(false);
        setIsCopied(false);
        setBattleLink(null);
    };

    const handleOnCopy = () => {
        setIsCopied(true);
    };

    const handleOnChange = e => {
        setResultModeValue(e.target.value);
    };

    return (
        <Modal open={visible} footer={null} onCancel={handleCancel}>
            <h2>Multiplayer - hra více hráčů</h2>
            <p>Hádej ta samá místa se svými přáteli v reálném čase a soupeřte o to, kdo bude rychlejší a přesnější.</p>
            <GuessResultMode value={resultModeValue} onChange={handleOnChange} />
            {battleLink && (
                <>
                    <p>
                        Odkaz z pozvánky zkopíruj, pošli dalším lidem a po jeho zadání do prohlížeče vstoupíte do té
                        samé hry. V jedné hře proti sobě může soupeřit až <b>{MAX_ALLOWED_BATTLE_PLAYERS} hráčů</b>!
                    </p>
                    <div className="battle-link-container">
                        <Input value={battleLink} onChange={() => {}} />
                        <div className="battle-link-container--clipboard">
                            <Tooltip title="zkopírovat odkaz do schránky">
                                <CopyToClipboard onCopy={handleOnCopy} text={battleLink}>
                                    <CopyTwoTone twoToneColor="#c80707" style={{ fontSize: '25px' }} />
                                </CopyToClipboard>
                            </Tooltip>
                        </div>
                    </div>
                    {isCopied ? <span style={{ color: 'red' }}>Zkopírováno do schránky</span> : null}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <Button type="primary" size="large">
                            {/* eslint-disable-next-line react/jsx-no-target-blank */}
                            <a href={battleLink} target="_blank" rel="noreferrer">
                                Vstoupit do hry
                            </a>
                        </Button>
                    </div>
                </>
            )}
            <Spin spinning={generateLinkInProgress} size="large">
                {!battleLink && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                                setGenerateLinkInProgress(true);
                                // eslint-disable-next-line implicit-arrow-linebreak
                                createBattle(
                                    randomUserToken,
                                    mode,
                                    radius,
                                    selectedCity,
                                    resultModeValue,
                                    regionNutCode,
                                )
                                    .then(docRef => {
                                        setGenerateLinkInProgress(false);
                                        setBattleLink(`${process.env.REACT_APP_WEB_URL}/battle/${docRef.id}`);
                                    })
                                    .catch(err => {
                                        setGenerateLinkInProgress(false);
                                    });
                            }}
                        >
                            Vygenerovat pozvánku
                        </Button>
                    </div>
                )}
            </Spin>
            <div style={{ marginTop: '20px' }}>
                <p>
                    Náhledy hry a herní princip je popsán v{' '}
                    <Link
                        to={{
                            pathname: '/napoveda',
                        }}
                    >
                        nápovědě
                    </Link>
                    .
                </p>
                <p>
                    Žádný spoluhráč po ruce? Domluv se{' '}
                    <a title="Discord" href="https://discord.gg/b9h3xdP6gG" target="_blank" rel="noreferrer">
                        na Discordu! <img alt="Discord" src={discordIcon} height={30} />
                    </a>
                </p>
            </div>
        </Modal>
    );
};

export default BattleLinkModal;
