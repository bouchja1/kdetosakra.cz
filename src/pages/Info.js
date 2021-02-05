import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { Typography, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { decryptEmail, generateRandomRadius } from '../util';
import gameModes from '../enums/modes';
import { firebaseUiConfig } from '../constants/firebase';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export const Info = () => {
    return (
        <Content>
            <Typography className="about-container">
                <Paragraph>
                    <Text className="highlighted">kdetosakra.cz</Text>
                    {' '}
                    je zeměpisná online hra a česká
                    {' '}
                    <a href="https://github.com/bouchja1/kdetosakra.cz" target="_blank" rel="noopener noreferrer">
                        open-source
                    </a>
                    {' '}
                    <GithubOutlined />
                    {' '}
                    alternativa k populární zahraniční hře
                    {' '}
                    <a href="https://geoguessr.com/" target="_blank">
                        GeoGuessr
                    </a>
                    .
                </Paragraph>
                <Paragraph>
                    Hra využívá panoramata a mapové podklady aplikace
                    {' '}
                    <a href="https://api.mapy.cz/" target="_blank">
                        Mapy.cz od Seznamu
                    </a>
                    . Hratelnost je takřka neomezená a jedinými limity jsou hranice České republiky 🇨🇿
                </Paragraph>
                <Title level={3}>O projektu</Title>
                <Paragraph>
                    Hru jsem naprogramoval koncem roku 2019 za účelem seznámení se s JS knihovnou React.js. Jedná se o
                    hobby projekt, který postupně vylepšuji. V plánu jsou i další rozšíření. Pokud vám hra dělá radost,
                    můžete
                    {' '}
                    <a href="https://www.buymeacoffee.com/mmwbwdq">podpořit její provoz nebo mi koupit kafe </a>
                    {' '}
                    ☕ ✌️️
                </Paragraph>
                <Title level={3}>Jak hrát?</Title>
                <Paragraph>
                    Hra nabízí
                    {' '}
                    <Text className="highlighted">čtyři herní módy</Text>
                    . Vaším úkolem je vypátrat v
                    několika kolech &quot;vaši&quot; polohu v různých místech České republiky. Pátrání začínáte v
                    náhodně vygenerovaném panoramatickém snímku a v přiložené mapě se snažíte s co nejvyšší přesností
                    určit, kde (v panoramatu) se právě nacházíte.
                </Paragraph>
                <Paragraph>Čím blíž svůj odhad na mapě umístíte, tím víc bodů v herním kole získáte.</Paragraph>
                <Paragraph>
                    Pokud zvolíte jiný herní mód než
                    {' '}
                    <Link
                        to={{
                            pathname: '/nahodne',
                        }}
                    >
                        Náhodné místo v Česku
                    </Link>
                    , hra předpokládá, že vybrané okolí alespoň trochu znáte. Proto je za horší odhad vyšší bodová
                    penalizace než u náhodně generovaných míst.
                </Paragraph>
                <Paragraph>
                    Hádání není časově omezeno. Pro přesnější odhad a lepší výsledek se tak můžete v panoramatu
                    libovolně pohybovat a dostat se až na místo, které je vám povědomé. Nebo spatříte název místa na
                    billboardu. Nebo dojedete až k ceduli označující název obce... nebo si vypracujete vlastní herní
                    strategii. To už je na vás.
                </Paragraph>
                <Paragraph>
                    Máte dotaz? Tak mi
                    {' '}
                    <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napište</a>
                    {' '}
                    ✉️.
                </Paragraph>
            </Typography>
        </Content>
    );
};
