import { Image, Layout } from 'antd';
import React from 'react';
import styled from 'styled-components';

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
                    <h1>Nový herní mód "Zajímavá místa v ČR"</h1>
                    <p>
                        <b>11. dubna 2024</b>
                    </p>
                    <p>
                        Před rokem a půl mě napadlo, že by bylo skvělé vytvořit v rámci KdeToSakra nový herní mód
                        zaměřený na poznávání zajímavých míst v České republice prostřednictvím fotek.
                    </p>
                    <p>
                        Požádal jsem vás, fanoušky a nadšence, jestli byste se chtěli podělit o fotky ze svých výletů a
                        tím přispět k tvorbě tohoto nápadu. Vaše ochota a nadšení mě naprosto ohromily – místo „pár
                        desítek fotek“, v které jsem doufal, se mi jich sešlo téměř 500! ❤️ Velké díky každému, kdo
                        přispěl – vážím si toho víc, než dokážu vyjádřit. 🙏
                    </p>
                    <p>
                        Bohužel jsem ale musel uznat, že jsem si ukrojil větší sousto, než dokážu zvládnout. Na
                        vytvoření herního módu nemám kapacitu ani čas.
                    </p>
                    <p>
                        Proto se vám všem, kdo jste se na tento mód těšili, omlouvám a zároveň znovu děkuji těm, kdo mi
                        poslali své fotky.
                    </p>
                    <p>Herní mód "Zajímavá místa v ČR" bohužel nevznikne.</p>
                    <h2>Co bude dál? KdeToSakra ukončí provoz na konci roku 2025</h2>
                    <h3>Bohužel</h3>
                    <p>
                        Nedávno mě oslovili z <a href="https://developer.mapy.cz/">Mapy.cz od Seznam.cz</a>, díky kterým
                        vlastně celý projekt KdeToSakra funguje. Upozornili mě, že jejich stávající REST API, na kterém
                        KdeToSakra běží, končí, a že nová verze bude placená podle množství stažených dlaždic s
                        panoramaty.
                    </p>
                    <Image alt="Upozornění na končící podporu" src={`${process.env.REACT_APP_WEB_URL}/mapy.png`} />
                    <p>↘️</p>
                    <p>
                        Proto už například poslední roky nejsou v KdeToSakra aktuální panorámata, což jste si mnozí
                        všimli a ptali se na to. 😉
                    </p>
                    <p>
                        Nová verze REST API od Seznamu je <a href="https://developer.mapy.cz/cena/">placená</a> dle
                        počtu stažených panorama dlaždic. A KdeToSakra byl a je nevýdělečný hobby{' '}
                        <a href="https://github.com/bouchja1/kdetosakra.cz">open source projekt</a>, takže si na sebe
                        nevydělá.
                    </p>
                    <p>
                        Požádal jsem o cenový odhad provozu na novém API, a odpověď mě přivedla k tvrdé realitě:{' '}
                        <b>Náklady by činily zhruba 100 000 Kč měsíčně</b>.
                    </p>
                    <Image
                        alt="Cenový odhad za používání nového REST API Mapy.cz"
                        src={`${process.env.REACT_APP_WEB_URL}/new-api-price.jpg`}
                        width="300px"
                        height="auto"
                    />
                    <br />
                    <p>
                        Jelikož je KdeToSakra nevýdělečný hobby projekt, dotovat ho takovou částkou jednoduše není
                        možné. Z mého pohledu by to nedávalo smysl a věřím, že ani z vašeho.
                    </p>
                    <h3>Co to znamená?</h3>
                    <p>
                        Do konce roku 2025 bych musel projekt přemigrovat na nové API, aby mohl fungovat jako dosud.
                        Bohužel se to ale ukazuje jako neproveditelné.
                    </p>
                    <p>Proto KdeToSakra přestane na konci roku 2025 fungovat.</p>
                    <p>
                        Chci touto cestou poděkovat týmu Seznam.cz, že jsme mohli tak dlouhou dobu využívat jejich API
                        zdarma a v takové míře. Z byznysového pohledu jejich rozhodnutí naprosto chápu.
                    </p>
                    <p>
                        A hlavně – děkuji vám všem, které tento projekt bavil, kteří jste ho hráli, podporovali a
                        šířili. Hrajte, dokud můžete, a užijte si to! 😉
                    </p>
                    <p>
                        Díky za všechny společné zážitky,{' '}
                        <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>Honza Bouchner</a>
                    </p>
                </EndIsNearModesContainer>
            </div>
        </Content>
    );
};
