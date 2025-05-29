import React from 'react';
import styled from 'styled-components';

import buyMeCoffee from '../assets/images/donate/buyMeCoffee.png';
import phoenixLightning from '../assets/images/donate/phoenixLightning.png';

interface DonateProps {
    marginBottom?: number;
}

const DonateContainer = styled.div<{ marginBottom: number }>`
    display: flex;
    justify-content: center;
    align-items: flex-start;
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
                Hru jsem naprogramoval koncem roku 2019, když jsem se chtěl blíž seznámit s JavaScript knihovnou React.
                Jedná se o hobby projekt a dělá mi radost, když někoho baví a přináší mu radost.
            </p>
            <p>
                Pokud ti hra dělá radost, potěší mě jakýkoliv příspěvek na pokrytí nákladů provozu (platby za server,
                kde hra běží) nebo další rozvoj (na to moje další kafe).
            </p>
            <DonateContainer marginBottom={marginBottom}>
                <DonateItems>
                    <p>
                        Poslat příspěvek na kafe přes <b>Lightning Network</b> ⚡️
                    </p>
                    <img src={phoenixLightning} height={200} />
                </DonateItems>
                <DonateItems>
                    <p>
                        Koupit mi kafe na webu <b>Buy me a coffee</b> ☕ ✌️️
                    </p>
                    <a href="https://www.buymeacoffee.com/mmwbwdq" target="_blank">
                        <img src={buyMeCoffee} height={100} />
                    </a>
                </DonateItems>
            </DonateContainer>
        </>
    );
};
