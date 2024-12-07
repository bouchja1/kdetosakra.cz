import { GithubOutlined } from '@ant-design/icons';
import { Image, Layout } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import krumlovInfo from '../assets/images/info/krumlovInfo.png';
import { Donate } from '../components/Donate';
import { decryptEmail } from '../util';

const { Content } = Layout;

export const Info = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>O hře</h2>
                <p>
                    <i>Kde to sakra?</i> je zeměpisná online hra a česká{' '}
                    <a href="https://github.com/bouchja1/kdetosakra.cz" target="_blank" rel="noopener noreferrer">
                        open-source
                    </a>{' '}
                    <GithubOutlined /> alternativa k populární zahraniční hře{' '}
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://geoguessr.com/" target="_blank" rel="noreferrer">
                        GeoGuessr
                    </a>
                    .
                </p>
                <p>
                    Hra využívá panoramata a mapové podklady aplikace{' '}
                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                    <a href="https://api.mapy.cz/" target="_blank" rel="noreferrer">
                        Mapy.cz od Seznamu
                    </a>
                    . Hratelnost je neomezená - jedinou hranicí je hranice České republiky 🇨🇿.
                </p>
                <div className="tutorial-section">
                    <h3>Průběh a cíl hry</h3>
                    <p>
                        Soutěžíš v pěti herních kolech. V každém kole tě KdeToSakra přenese na jiné místo naší vlasti a
                        ty se můžeš virtuálně procházet po jeho okolí. Tvým úkolem je zorientovat se a v přiložené mapce
                        označit co nejpřesněji místo, kde se právě nacházíš.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image alt="Princip hry KdeToSakra" src={krumlovInfo} />
                    </div>
                </div>
                <p>
                    Před začátkem každé nové hry je možné zvolit si, jakou polohu v mapě chceš v jednotlivých kolech
                    tipovat jako svůj výsledek. Celkové skóre se počítá jako součet výsledků ze všech pěti kol.
                </p>
                <ul>
                    <li>
                        <b>hádat aktuální polohu v panoráma</b> - tj. dojedeš v panoráma někam, kde už to bezpečně
                        poznáváš (<i>"A hele! Tohle je nádraží!"</i>). A pak označíš místo s přesností na metr.
                    </li>
                    <li>
                        <b>hádat polohu místa, kde začínám</b> - aneb GeoGuessr. Zjistiš, kde to sakra jsi, a pak se v
                        mapě snažíš dohledat místo odkud se vyráželo.
                    </li>
                </ul>
                <h3>Typy her</h3>
                <p>Hra má pět herních módů pro hádání náhodně vygenerované polohy v panorámatu:</p>
                <ol>
                    <li>hádání vlastnoručně zadaného místa</li>
                    <li>hádání místa v celé ČR</li>
                    <li>hádání místa ve vybraném kraji</li>
                    <li>hádání místa ve vybraném krajském městě ČR</li>
                    <li>hádání místa v bezprostředním okolí (podle geolokace zařízení)</li>
                </ol>
                <p>
                    První čtyři herní módy je možné hrát i v módu <i>multiplayer</i> (ve stejný čas proti sobě soupeří
                    více hráčů).
                </p>
                <p>
                    Detailnější informace jsou k nalezení v{' '}
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
                <Donate marginBottom={25} />
                <p>
                    Máte dotaz nebo přání? Tak mi <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napište</a>{' '}
                    ✉️.
                </p>
                <p>
                    <a href="https://www.linkedin.com/in/janbouchner/" target="_blank">
                        Jan Bouchner
                    </a>
                </p>
            </div>
        </Content>
    );
};
