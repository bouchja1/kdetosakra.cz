import { Image, Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

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
                    <h1>Nový herní mód "Zajímavá místa v ČR"</h1>
                    <p>
                        <b>11. dubna 2024</b>
                    </p>
                    <p>
                        Onehdá (už to bude rok a půl) jsem si vymyslel, že by bylo fajn vytvořit v KdeToSakra nový herní
                        mód založený na poznávání zajímavých míst v ČR na základě fotek.
                    </p>
                    <p>
                        Vás – fanoušky a nadšence – jsem prosil o to, že pokud máte fotky ze svých výletů, které jste
                        ochotni sdílet a máte chuť s tvorbou nového herního módu pomoci, ať neváhejte a pálíte mi je sem
                        😊.
                    </p>
                    <p>
                        Oproti mému původnímu očekávání („pár desítek by bylo supr“) se k dnešku sešlo skoro 500 fotek
                        od různých autorů. A já všem děkuji za příspěvky! 😉 🙏
                    </p>
                    <p>
                        Fakt je ten, že jsem si ukrojil větší sousto, než jsem schopen zpracovat. Jinými slovy: Na
                        tvorbu nového herního módu nemám bohužel čas.
                    </p>
                    <p>
                        Omlouvám se všem, co se na nový herní mód těšili, a ještě jednou velký dík těm, co mi sem
                        nahráli své fotky.
                    </p>
                    <p>Herní mód "Zajímavá místa v ČR" nebude.</p>
                    <h2>Co bude s KdeToSakra dál? Aneb na konci roku 2025 zavíráme krám</h2>
                    <h3>Bohužel</h3>
                    <p>
                        Psali mi z <a href="https://developer.mapy.cz/">Mapy od Seznam.cz</a>, díky kterým vlastně celé
                        KdeToSakra funguje.
                    </p>
                    <Image alt="Upozornění na končící podporu" src={`${process.env.REACT_APP_WEB_URL}/mapy.png`} />
                    <p>↘️</p>
                    <p>
                        Jo, tohle je přesně důvod toho, proč nejsou v KdeToSakra aktuální panorámata, jak se spousta z
                        vás v průběhu posledních let ptalo 😉.
                    </p>
                    <p>
                        Nová verze REST API od Seznamu je <a href="https://developer.mapy.cz/cena/">placená</a> dle
                        počtu stažených panorama dlaždic. A KdeToSakra byl a je nevýdělečný hobby{' '}
                        <a href="https://github.com/bouchja1/kdetosakra.cz">open source projekt</a>, takže si na sebe
                        nevydělá.
                    </p>
                    <p>
                        Poprosil jsem o cenový odhad provozu po případném přemigrování na nové API a dostal jsem
                        následujícíc odpověď:
                    </p>
                    <Image
                        alt="Cenový odhad za používání nového REST API Mapy.cz"
                        src={`${process.env.REACT_APP_WEB_URL}/new-api-price.jpg`}
                        width="300px"
                        height="auto"
                    />
                    <br />
                    <p>Dotovat hobby projekt desítkami tisíc měsíčně nedává smysl ani mně, a určitě ani vám.</p>
                    <p>
                        Do konce roku 2025 bych tedy musel projekt přemigrovat na novou verzi API, aby všechno fungovalo
                        jako doposud, ale i tak by pak byly náklady na provoz cca 100 000 Kč měsíčně.
                    </p>
                    <p>
                        To bohužel znamená, že <b>KdeToSakra přestane koncem roku 2025 fungovat</b>.
                    </p>
                    <p>
                        Nejen z byznysového pohledu Seznam.cz naprosto chápu a moc děkuji, že jsme tak dlouho mohli
                        využít úplně <b>zdarma</b> a v takové míře jejich zdroje.
                    </p>
                    <p>Díky všem, které to bavilo, baví a hrajte dokud můžete! 😉</p>
                    <p>Honza Bouchner</p>
                </EndIsNearModesContainer>
            </div>
        </Content>
    );
};
