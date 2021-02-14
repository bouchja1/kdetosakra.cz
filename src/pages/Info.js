import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { decryptEmail } from '../util';

const { Content } = Layout;

export const Info = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>O hře</h2>
                <p>
                    kdetosakra.cz je zeměpisná online hra a česká
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
                </p>
                <p>
                    Hra využívá panoramata a mapové podklady aplikace
                    {' '}
                    <a href="https://api.mapy.cz/" target="_blank">
                        Mapy.cz od Seznamu
                    </a>
                    . Hratelnost je takřka neomezená a jedinými limity jsou hranice České republiky 🇨🇿
                </p>
                <h3>Jak hrát?</h3>
                <p>
                    Hra nabízí
                    {' '}
                    <b>čtyři herní módy</b>
                    . Vaším úkolem je vypátrat v několika kolech &quot;vaši&quot;
                    polohu v různých místech České republiky. Pátrání začínáte v náhodně vygenerovaném panoramatickém
                    snímku a v přiložené mapě se snažíte s co nejvyšší přesností určit, kde (v panoramatu) se právě
                    nacházíte.
                </p>
                <p>Čím blíž svůj odhad na mapě umístíte, tím víc bodů v herním kole získáte.</p>
                <p>
                    Pokud zvolíte jiný herní mód než
                    {' '}
                    <Link
                        to={{
                            pathname: '/nahodne',
                        }}
                    >
                        Náhodné místo v Česku
                    </Link>
                    , hra předpokládá, že vybrané okolí alespoň trochu znáte. Proto je za nepřesný odhad vyšší bodová
                    penalizace než u náhodně generovaných míst.
                </p>
                <p>
                    Hádání není časově omezeno. Pro přesnější odhad a lepší výsledek se tak můžete v panoramatu
                    libovolně pohybovat a dostat se až na místo, které je vám povědomé. Nebo spatříte název místa na
                    billboardu. Nebo dojedete až k ceduli označující název obce... nebo si vypracujete vlastní herní
                    strategii. To už je na vás.
                </p>
                <h3>O projektu</h3>
                <p>
                    Hru jsem naprogramoval koncem roku 2019 za účelem seznámení se s JS knihovnou React.js. Jedná se o
                    hobby projekt, který postupně vylepšuji. V plánu jsou i další rozšíření. Pokud vám hra dělá radost,
                    můžete
                    {' '}
                    <a href="https://www.buymeacoffee.com/mmwbwdq">podpořit její provoz nebo mi koupit kafe </a>
                    {' '}
                    ☕ ✌️️
                </p>
                <p>
                    Máte dotaz? Tak mi
                    {' '}
                    <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napište</a>
                    {' '}
                    ✉️.
                </p>
            </div>
        </Content>
    );
};
