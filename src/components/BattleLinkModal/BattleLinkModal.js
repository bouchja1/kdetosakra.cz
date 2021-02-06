import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createBattle } from '../../services/firebase';
import useGetRandomUserToken from '../../hooks/useGetRandomUserToken';

const BattleLinkModal = ({
    visible, handleBattleModalVisibility, mode, radius, selectedCity,
}) => {
    const randomUserToken = useGetRandomUserToken();
    const [battleLink, setBattleLink] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCancel = () => {
        handleBattleModalVisibility(false);
        setIsCopied(false);
        setBattleLink(null);
    };

    const handleOnCopy = () => {
        setIsCopied(true);
    };

    return (
        <Modal title="Basic Modal" visible={visible} footer={null} onCancel={handleCancel}>
            <p>TODO:</p>
            <p>jaký herní mód</p>
            <p>informace (že můžeš hrát s až 5 přáteli atd.) a že vygeneruješ link, kt. pošleš přátelům</p>
            {battleLink && (
                <>
                    <div>
                        <Input value={battleLink} onChange={() => {}} />
                        <CopyToClipboard onCopy={handleOnCopy} text={battleLink}>
                            <button type="submit">Copy to clipboard</button>
                        </CopyToClipboard>
                    </div>
                    {isCopied ? <span style={{ color: 'red' }}>Zkopírováno</span> : null}
                </>
            )}
            <Button
                type="primary"
                onClick={() =>
                    // TODO city!!!!!
                    // eslint-disable-next-line implicit-arrow-linebreak
                    createBattle(randomUserToken, mode, radius, selectedCity)
                        .then(docRef => {
                            setBattleLink(`http://localhost:3000/battle/${docRef.id}`);
                        })
                        .catch(err => {})}
            >
                Vygenerovat link
            </Button>
        </Modal>
    );
};

export default BattleLinkModal;
