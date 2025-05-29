import { Image, Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { DonateContent } from '../components/DonateContent';
import { decryptEmail } from '../util';
import { borderRadiusBase, componentBackground } from '../util/theme';

const { Content } = Layout;

const EndIsNearModesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    background: ${componentBackground};
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: ${borderRadiusBase};
    padding: 15px 30px 15px 30px;
`;

export const EndIsNear = () => {
    return (
        <Content>
            <div className="end-is-near-container">
                <EndIsNearModesContainer>
                    <h2>Bohužel</h2>
                    <p>
                        Nedávno mě oslovili <a href="https://developer.mapy.cz/">Mapy.cz</a>, díky kterým celý projekt
                        KdeToSakra funguje. Upozornili mě, že jejich stávající{' '}
                        <a href="https://developer.mapy.cz/js-api/">JS SDK</a> (zdroj dat, fotografií a map pro náš web)
                        koncem roku 2025 vypnou a bude nahrazeno novou verzí.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Image
                            alt="Upozornění na končící podporu"
                            src={`${process.env.REACT_APP_WEB_URL}/mapy.png`}
                            height={150}
                        />
                    </div>
                    <br />
                    <p>
                        Nová verze REST API od Seznamu je <a href="https://developer.mapy.cz/cena/">placená</a> dle
                        počtu stažených panorama dlaždic.
                    </p>
                    <p>
                        Požádal jsem o cenový odhad provozu na novém API, a odpověď mě přivedla k tvrdé realitě:{' '}
                        <b>Náklady by činily zhruba 100 000 Kč měsíčně</b>.
                    </p>
                    <p>
                        KdeToSakra byl a je nevýdělečný hobby{' '}
                        <a href="https://github.com/bouchja1/kdetosakra.cz">open source projekt</a>, takže si na sebe
                        nevydělá a dotovat ho takovou částkou jednoduše není možné.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Image
                            alt="Cenový odhad za používání nového REST API Mapy.cz"
                            src={`${process.env.REACT_APP_WEB_URL}/new-api-price.jpg`}
                            height={150}
                        />
                    </div>
                    <br />
                    <h3>Co to znamená?</h3>
                    <p>KdeToSakra přestane na konci roku 2025 fungovat.</p>
                    <p>
                        Chci touto cestou poděkovat společnosti Seznam.cz, že jsme mohli tak dlouhou dobu využívat
                        jejich API zdarma a v takové míře. Z byznysového pohledu jejich rozhodnutí naprosto chápu.
                    </p>
                    <p>
                        A hlavně! – děkuji vám všem, které tento projekt bavil, kteří jste ho hráli, podporovali a
                        šířili. Hrajte, dokud můžete, a užijte si to! 😉
                    </p>
                    <h2>Poděkovat</h2>
                    <p>
                        Nechávám za sebou provoz a vyšší desítky, spíš nižší stovky hodin práce pro bono 🙂. Pokud mně
                        chcete podpořit v mých dalších budoucích aktivitách nebo poděkovat nad rámec, můžete mi zaslat
                        příspěvek.
                    </p>
                    <DonateContent marginBottom={15} />
                    <p>
                        Díky za společné zážitky,{' '}
                        <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>Honza Bouchner</a>
                    </p>
                </EndIsNearModesContainer>
            </div>
        </Content>
    );
};
