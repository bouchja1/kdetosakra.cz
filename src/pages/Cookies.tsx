import { InfoCircleOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import { Donate } from '../components/Donate';
import { routeNames } from '../constants/routes';
import { decryptEmail } from '../util';

const { Content } = Layout;

export const CookiesPage = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>Zásada používání Cookies pro web www.kdetosakra.cz</h2>
                <h3>Úvod</h3>
                <p>
                    Tyto zásady používání cookies popisují, jak web www.kdetosakra.cz ("web", "my", "nás") používá
                    cookies a podobné technologie k zajištění nejlepšího uživatelského zážitku a ke shromažďování dat.
                </p>

                <h3>Co jsou cookies?</h3>
                <p>
                    Cookies jsou malé datové soubory ukládané ve vašem zařízení (počítač, mobilní telefon, tablet) při
                    prohlížení webu. Pomáhají webu zapamatovat si informace o vaší návštěvě, jako jsou preferovaný jazyk
                    a další nastavení. To může usnadnit vaši další návštěvu a zpříjemnit uživatelský zážitek.
                </p>

                <h3>Jak používáme cookies?</h3>
                <p>Na našem webu používáme cookies k různým účelům:</p>
                <h4>Nezbytné cookies</h4>
                <p>
                    Tyto cookies jsou nezbytné pro fungování webu a nelze je vypnout. Neuchovávají žádné osobní údaje.
                </p>
                <h4>Výkonnostní a analytické cookies</h4>
                <p>Pomáhají nám rozumět, jak návštěvníci používají web, a zlepšovat naše služby.</p>
                <h4>Funkční cookies</h4>
                <p>
                    Tyto cookies umožňují webu zapamatovat si vaše volby a poskytnout pokročilé, personalizované funkce.
                </p>
                <h4>Reklamní cookies</h4>
                <p>Používáme je k zobrazení relevantních reklam na našem a jiných webech.</p>

                <h3>Vaše volby</h3>
                <p>
                    Při první návštěvě webu vás požádáme o souhlas s používáním cookies. Můžete svůj souhlas kdykoli
                    odvolat nebo upravit nastavení cookies ve svém prohlížeči.
                </p>
                <p>
                    Většina prohlížečů automaticky akceptuje cookies, ale obvykle můžete změnit nastavení prohlížeče
                    tak, aby cookies odmítal, pokud to preferujete.
                </p>
                <h3>Ochrana osobních údajů</h3>
                <p>
                    Pro informace o zpracování vašich osobních údajů navštivte naše{' '}
                    <Link target="_blank" to={`/${routeNames.podminky}`}>
                        Podmínky používání
                    </Link>
                    .
                </p>
                <h3>Kontaktujte nás</h3>
                <p>
                    Pokud máte jakékoli dotazy týkající se naší zásady používání cookies, neváhejte nás kontaktovat na
                    <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>e-mail</a>).
                </p>
                <h3>Změny zásad</h3>
                <p>
                    Tyto zásady mohou být pravidelně aktualizovány, aby odrážely změny v našich praktikách nebo změny v
                    právních požadavcích.
                </p>
                <p>
                    <a href="#" id="open_preferences_center">
                        Upravit svůj souhlas s cookies.
                    </a>
                </p>
                <p>Tyto podmínky jsou platné od 14. 12. 2023</p>
            </div>
        </Content>
    );
};
