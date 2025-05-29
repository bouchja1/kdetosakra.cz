import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import buyMeCoffee from '../assets/images/donate/buyMeCoffee.png';
import phoenixLightning from '../assets/images/donate/phoenixLightning.png';
import { routeNames } from '../constants/routes';

interface DonateProps {
    marginBottom?: number;
    withDonate?: boolean;
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

export const DonateContent = ({ marginBottom = 0, withDonate = false }: DonateProps) => {
    return (
        <>
            {withDonate && (
                <>
                    <DonateContainer marginBottom={0}>
                        <p>
                            <Link to={`/${routeNames.endIsNear}`}>
                                Provoz kdetosakra.cz bude v prosinci 2025 ukončen
                            </Link>
                            . Nechávám za sebou provoz a vyšší desítky, spíš nižší stovky hodin práce pro bono 🙂. Pokud
                            mně chcete podpořit v mých dalších budoucích aktivitách nebo poděkovat nad rámec, můžete mi
                            zaslat příspěvek.
                        </p>
                    </DonateContainer>
                </>
            )}
            <DonateContainer marginBottom={marginBottom}>
                <DonateItems>
                    <p>
                        Poslat příspěvek na kafe přes <b>Lightning Bolt 12 Network</b> ⚡️
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
