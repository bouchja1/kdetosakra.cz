import { InfoCircleOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { Donate } from '../components/Donate';
import { routeNames } from '../constants/routes';
import { decryptEmail } from '../util';

const { Content } = Layout;

export const TermsPage = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>Podmínky používání webové stránky KdeToSakra.cz</h2>
                <h3>Úvod</h3>
                <p>
                    Vítejte na webu KdeToSakra.cz, který slouží ke hraní geografických her a poznávání nových míst v
                    České republice. Poskytovatel této webové stránky je Jan Bouchner (
                    <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>e-mail</a>). Pro používání této webové
                    stránky platí následující podmínky použití. Používáním této webové stránky souhlasíte s těmito
                    podmínkami. Pokud s těmito podmínkami nesouhlasíte, prosím nepoužívejte tuto webovou stránku.
                </p>

                <h3>Hry a herní mód</h3>
                <p>
                    KdeToSakra.cz poskytuje uživatelům několik geografických her, které jsou určeny k zábavě a poznávání
                    nových míst v České republice. Hry jsou zdarma a jsou dostupné pro každého. Více o jednotlivých
                    hrách je k nalezení v sekci{' '}
                    <Link to={`/${routeNames.info}`}>
                        <div className="menu-item">O hře</div>
                    </Link>
                    .
                </p>

                <h3>Ochrana osobních údajů</h3>
                <p>
                    Při používání webu KdeToSakra.cz shromažďujeme některé vaše osobní údaje. Tyto údaje jsou plně
                    anonymní a neobsahují citlivé údaje, které by mohly osobu blíže identifikovat. Jedná se pouze o
                    údaje o užívání webu KdeToSakra.cz (typ prohlížeče, verze operačního systému, technické informace
                    apod.) Tyto údaje jsou použity pro účely statistik a zlepšení služby.
                </p>

                <h3>Nahrávání fotografií a komunikace</h3>
                <p>
                    KdeToSakra.cz umožňuje uživatelům nahrávat fotografie. Tyto fotografie budeme používat pouze pro
                    účely hry. Pokud budete nahrávat fotografie, ujistěte se, že máte oprávnění k použití těchto
                    fotografií, a že nesdílíte žádný obsah, který je nezákonný, vulgární nebo jinak závadný.
                </p>
                <p>
                    Všechny fotografie, které nahráváte na webové stránky KdeToSakra.cz, musí být vaše vlastní tvorba
                    nebo musíte mít právo je použít a sdílet pod licencí <b>Creative Commons</b>. Tím, že nahráváte
                    fotografie na naše webové stránky, souhlasíte s tím, že tyto fotografie mohou být použity a sdíleny
                    pod licencí <i>Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</i>.
                    Podrobnější informace o této licenci najdete na stránce{' '}
                    <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank">
                        https://creativecommons.org/licenses/by-sa/4.0/
                    </a>
                    . V případě, že nechcete, aby vaše fotografie byly použity pod touto licencí, nenahrávejte je.
                </p>
                <h3>Seznam subdodavatelů</h3>
                <ul>
                    <li>Hetzner Online GmbH (EU) - server</li>
                    <li>Sentry, Inc. (USA) - logování chyb na stránce</li>
                    <li>Firebase (USA) - databáze</li>
                </ul>
                <p>Tyto podmínky jsou platné od 5. 3. 2023</p>
            </div>
        </Content>
    );
};
