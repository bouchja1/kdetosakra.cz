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
                <h2>O projektu</h2>
                <p>
                    <i>Kde to sakra?</i>
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
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://geoguessr.com/" target="_blank" rel="noreferrer">
                        GeoGuessr
                    </a>
                    .
                </p>
                <p>
                    Hra využívá panoramata a mapové podklady aplikace
                    {' '}
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://api.mapy.cz/" target="_blank" rel="noreferrer">
                        Mapy.cz od Seznamu
                    </a>
                    . Hratelnost je takřka neomezená a jedinou hranicí je hranice České republiky 🇨🇿
                </p>
                <h3>Jak hrát?</h3>
                <p>Hra nabízí pět různých herních módů:</p>
                <ol>
                    <li>Krajská města ČR</li>
                    <li>Náhodné místo (celá ČR)</li>
                    <li>Náhodné místo (v kraji ČR)</li>
                    <li>Vlastní místo</li>
                    <li>Podle mojí geolokace</li>
                </ol>
                <p>
                    První tři je možné hrát i v módu
                    {' '}
                    <i>multiplayer</i>
                    {' '}
                    (ve stejný čas hraje více hráčů proti sobě).
                </p>
                <p>
                    Cílem hry je vypátrat v pěti kolech polohu pěti různých míst v České republice. Pátrání začínáš v
                    náhodně generovaném panoramatickém snímku a v přiložené mapě se snažíš s co nejvyšší přesností
                    určit, kde (v panoramatu) se právě nacházíš.
                </p>
                <p>
                    Obsáhlejší informace jsou k nalezení v
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
                <h3>Vznik</h3>
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
                    Máte dotaz nebo přání? Tak mi
                    {' '}
                    <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napište</a>
                    {' '}
                    ✉️.
                </p>
            </div>
        </Content>
    );
};
