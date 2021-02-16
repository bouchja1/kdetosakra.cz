import React, { useState } from 'react';
import {
    Button, Input, Modal, Tooltip, Spin
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { createBattle } from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const BattleLinkModal = ({
    visible, handleBattleModalVisibility, mode, radius, selectedCity,
}) => {
    const randomUserToken = useGetRandomUserToken();
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

    return (
        <Modal visible={visible} footer={null} onCancel={handleCancel}>
            <h2>Multiplayer - hra více hráčů</h2>
            <p>Hádej ta samá místa se svými přáteli v reálném čase a soupeřte o to, kdo bude rychlejší a přesnější.</p>
            {battleLink && (
                <>
                    <p>
                        Odkaz z pozvánky zkopíruj, pošli dalším lidem a po jeho zadání do prohlížeče vstoupíte do té
                        samé hry. V jedné hře proti sobě může soupeřit až
                        {' '}
                        <b>5 hráčů</b>
                        !
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
                </>
            )}
            <Spin spinning={generateLinkInProgress} size="large">
                {!battleLink && (
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>
                            Probíhá oprava chyb nalezených v 1. veřejném testování. Multiplayer bude k dispozici během
                            několika dnů.
                        </p>
                        <p>
                            Pro čerstvé informace doporučuji sledovat
                            {' '}
                            <a href="https://www.facebook.com/kdetosakra.cz" target="_blank" rel="noreferrer">
                                stránku na Facebooku.
                            </a>
                        </p>
                        <Button
                            disabled
                            type="primary"
                            onClick={() => {
                                /*
                                setGenerateLinkInProgress(true);
                                // eslint-disable-next-line implicit-arrow-linebreak
                                createBattle(randomUserToken, mode, radius, selectedCity)
                                    .then(docRef => {
                                        setGenerateLinkInProgress(false);
                                        setBattleLink(`${window._env_.REACT_APP_WEB_URL}/battle/${docRef.id}`);
                                    })
                                    .catch(err => {
                                        setGenerateLinkInProgress(false);
                                    });
                                 */
                            }}
                        >
                            Vygenerovat pozvánku
                        </Button>
                    </div>
                )}
            </Spin>
            <div style={{ marginTop: '20px' }}>
                <p>
                    Náhledy hry a herní princip je popsán v
                    {' '}
                    <Link
                        to={{
                            pathname: '/napoveda',
                        }}
                    >
                        nápovědě
                    </Link>
                    .
                </p>
            </div>
        </Modal>
    );
};

export default BattleLinkModal;
