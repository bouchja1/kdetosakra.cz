import React, { useState } from 'react';
import {
    Button, Input, Modal, Typography, Tooltip, Image, Spin
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyTwoTone } from '@ant-design/icons';
import { createBattle } from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const { Title } = Typography;

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
            <Title level={4}>Hra s přáteli (multiplayer)</Title>
            <p>
                Chceš hádat stejná místa se svými přáteli a třeba i soupeřit o to, kdo dané místo trefí přesněji?
                {' '}
                <b>Vygeneruj si pozvánku!</b>
            </p>
            {battleLink && (
                <>
                    <p>
                        Odkaz z pozvánky zkopíruj, pošli přátelům a po jeho zadání do prohlížeče vstoupíte do té samé
                        hry.
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
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setGenerateLinkInProgress(true);
                                // eslint-disable-next-line implicit-arrow-linebreak
                                createBattle(randomUserToken, mode, radius, selectedCity)
                                    .then(docRef => {
                                        setGenerateLinkInProgress(false);
                                        setBattleLink(`http://localhost:3000/battle/${docRef.id}`);
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
            <p style={{ marginTop: '15px' }}>
                Ten, kdo vygeneroval odkaz, má jako admin možnost zvolit na začátku styl hry - zda bude v každém kole po
                tipu nejrychlejšího hráče zahájen
                {' '}
                <i>odpočet zbývajícího času pro tipy ostatních hráčů</i>
                , nebo je
                možné hrát
                <i>bez odpočtu</i>
                {' '}
                a projít si tak beze spěchu stejná místa, která se budou generovat i ostatním.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                    alt="Multiplayer před zahájením hry - pohled admina"
                    width={300}
                    src={`${window._env_.REACT_APP_WEB_URL}/multiplayer.png`}
                />
            </div>
        </Modal>
    );
};

export default BattleLinkModal;
