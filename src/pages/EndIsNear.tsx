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
            <div className="about-container">
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
                        od různých autorů. A já všem moc děkuji za příspěvky! 😉 🙏
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
                    <h2>Co bude s KdeToSakra dál?</h2>
                    <p>
                        Psaly mi <a href="https://developer.mapy.cz/">Mapy od Seznam.cz</a>, díky kterým celé KdeToSakra
                        funguje.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image alt="Multiplayer - získání odkazu" src={`${process.env.REACT_APP_WEB_URL}/mapy.png`} />
                    </div>
                    <p>↘️</p>
                    <p>Jo, tohle je přesně důvod toho, proč nejsou v KdeToSakra aktuální panorámata 😉. </p>
                    <p>
                        Nová verze REST API od Seznamu je navíc placená. KdeToSakra byl a je nevýdělečný hobby projekt,
                        takže si na sebe nevydělá.
                    </p>
                    <p>
                        Do konce roku 2025 bych měl projekt přemigrovat na novou verzi API, aby všechno fungovalo jako
                        doposud, ale platí to, co jsem napsal výše: nemám na to bohužel čas. Takže{' '}
                        <b>KdeToSakra přestane koncem roku 2025 fungovat</b>.
                    </p>
                    <p>Díky všem, které to bavilo, baví a hrajte dokud můžete! 😉</p>
                    <p>Honza Bouchner</p>
                </EndIsNearModesContainer>
            </div>
        </Content>
    );
};
