import React from 'react';
import styled from 'styled-components';

import btcLightning from '../assets/images/donate/btcLightning.png';
import buyMeCoffee from '../assets/images/donate/buyMeCoffee.png';

interface DonateProps {
    marginBottom?: number;
}

const DonateContainer = styled.div<{ marginBottom: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    flex-wrap: wrap;
    margin-bottom: ${({ marginBottom }) => `${marginBottom}px`};
`;

const DonateItems = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 150px;
`;

export const Donate = ({ marginBottom = 0 }: DonateProps) => {
    return (
        <>
            <p>
                Pokud vám hra dělá radost, potěší mě jakýkoliv příspěvek na její provoz (platby za server) nebo další
                rozvoj (na to další kafe).
            </p>
            <DonateContainer marginBottom={marginBottom}>
                <DonateItems>
                    <p>
                        Poslat příspěvek na kafe přes <b>Lightning Network</b> ⚡️
                    </p>
                    <a href="https://getalby.com/p/kdetosakra">
                        <img src={btcLightning} height={100} />
                    </a>
                </DonateItems>
                <DonateItems>
                    <p>
                        Koupit mi kafe na webu <b>Buy me a coffee</b> ☕ ✌️️
                    </p>
                    <a href="https://www.buymeacoffee.com/mmwbwdq">
                        <img src={buyMeCoffee} height={100} />
                    </a>
                </DonateItems>
            </DonateContainer>
        </>
    );
};
