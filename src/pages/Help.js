import { Image, Layout } from 'antd';
import React from 'react';

import { MAX_ALLOWED_BATTLE_PLAYERS, MIN_DISTANCE_FOR_POINTS_RANDOM } from '../constants/game';

const { Content } = Layout;

export const Help = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>Jak to hrát?</h2>
                <h3>Princip hry</h3>
                <p>
                    Soutěžíš v pěti herních kolech. V každém kole tě KdeToSakra přenese na jiné místo naší vlasti a ty
                    se můžeš virtuálně procházet po jeho okolí. Tvým úkolem je zorientovat se a v přiložené mapce
                    označit co nejpřesněji místo, kde se právě nacházíš.
                </p>
                <p>Cílem hry je v každém kole určit co nejpřesněji polohu tohoto místa.</p>
                <p>
                    Před začátkem každé nové hry je možné zvolit si, jakou polohu v mapě chceš v jednotlivých kolech
                    tipovat jako svůj výsledek. Celkové skóre se počítá jako součet výsledků ze všech pěti kol.
                </p>
                <ul>
                    <li>
                        <b>hádat aktuální polohu v panorama</b> - tj. dojedeš v panoráma někam, kde už to bezpečně
                        poznáváš (<i>"A hele! Tohle je nádraží!"</i>). A pak označíš místo s přesností na metr.
                    </li>
                    <li>
                        <b>hádat polohu místa, kde začínám</b> - aneb GeoGuessr. Zjistiš, kde to sakra jsi, a pak se v
                        mapě snažíš dohledat místo odkud se vyráželo.
                    </li>
                </ul>
                <p>
                    <b>Čím blíž svůj odhad na mapě umístíš, tím víc bodů v herním kole získáváš!</b>
                </p>
                <p>Hra má pět herních módů pro hádání náhodně vygenerované polohy v panorámatu:</p>
                <ol>
                    <li>hádání vlastnoručně zadaného místa</li>
                    <li>hádání místa v celé ČR</li>
                    <li>hádání místa ve vybraném kraji</li>
                    <li>hádání místa ve vybraném krajském městě ČR</li>
                    <li>hádání místa v bezprostředním okolí (podle geolokace zařízení)</li>
                </ol>
                <h3>Bodování</h3>
                <p>
                    Pokud si vybereš herní módy <b>2)</b> a <b>3)</b>, KdeToSakra vyhodnocuje získané body mírněji. V
                    ostatních případech se předpokládá, že vybraná místa alespoň trochu znáš a proto je za ne až tak
                    přesný odhad přísnější a nedostaneš tolik bodů.
                </p>
                <ul>
                    <li>
                        když hraješ <b>2)</b> nebo <b>3)</b>, pro získání alespoň nějakých bodů musí být tvůj tip ne dál
                        než {MIN_DISTANCE_FOR_POINTS_RANDOM} km od hádaného místa.
                    </li>
                    <li>
                        pro ostatní herní módy je to tak, že tvůj tip musí být ne dál než 3 km od hádaného místa (nebo 3
                        km + <i>radius</i> v km, který si můžeš nastavit přes začátkem nové hry.
                    </li>
                    <li>
                        <b>100 %</b> (= 100 bodů) získáš, když se trefíš ne dál než 30 metrů od hádaného místa.
                    </li>
                </ul>
                <p>
                    Hádat můžeš jak dlouho chceš - žádné odpočítávání zbývajícího času (to neplatí pro hru více hráčů -
                    viz dále). Pro přesnější odhad a vyšší bodový zisk se tak můžeš v panoramatu libovolně pohybovat.
                    Dostaneš se pak třeba na místo, které je ti povědomé. Nebo uvidíš jméno města na billboardu. Nebo
                    &quot;dojedeš&quot; až k ceduli s názvem obce, pak najdeš nejbližší nádraží a odtud už se
                    zorientuješ dál.
                </p>
                <p>Nebo si vypracuješ vlastní unikátní herní strategii, je to na tobě 😉.</p>
                <h3 id="how-to-multiplayer">Jak hrát multiplayer mód</h3>
                <div className="tutorial-section">
                    <h4>Vytvoření hry pro více hráčů</h4>
                    <p>
                        Zakladatel hry si vybere jeden z herních módů a zvolí možnost <b>Více hráčů</b>. Vygeneruje
                        pozvánku a tím získá odkaz pro vstup do hry, který si zkopíruje a pošle ho ostatním hráčům.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer - získání odkazu"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-00-admin.png`}
                        />
                    </div>
                </div>
                <p>
                    Společnou hru může hrát až {MAX_ALLOWED_BATTLE_PLAYERS} hráčů. Ostatní si otevřou zaslaný odkaz v
                    prohlížeči a všichni se octnou ve společné herní místnosti.
                </p>
                <div className="tutorial-section">
                    <h4>Nastavení hry před začátkem hádání (pohled tvůrce hry)</h4>
                    <p>
                        Zakladatel je správcem hry. Před začátkem prvního kola může změnit hodnotu odpočtu (v
                        sekundách). Čas do konce kola se začne odpočítávat, když nejrychlejší hráč umístí svůj tip.
                    </p>
                    <p>
                        Každý z hráčů, co dostal pozvánku a otevřel si odkaz, musí před začátkem hry zvolit možnost{' '}
                        <b>Připraven</b>.
                    </p>
                    <p>Jakmile jsou všichni hráči připraveni, správce může odstartovat hru.</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled admina"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-01-admin.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Hra před začátkem hádání (pohled pozvaného hráče)</h4>
                    <p>
                        Hráč přijal pozvánku a vstoupil do hry. Jakmile je připraven zahájit 1. kolo, volí možnost
                        &quot;Připraven&quot;.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče, který musí zvolit, že je připraven"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-02-player-not-ready.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Hráč umístil tip jako první</h4>
                    <p>
                        Po umístění tipu nejrychlejšího hráče začíná odpočet zbývajících sekund do konce kola. Ostatní
                        hráči si musí pospíšit a umístit své tipy dřív než čas vyprší, jinak v tomto kole získávají 0
                        bodů. Počet získaných bodů <b>nezáleží</b> na rychlosti umístění tipu ani pořadí umístění tipu.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče, který umístil tip jako první"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-03-player-guessed.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Konec kola - všichni hráči umístili své tipy (pohled pozvaného hráče)</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče, který čeká na další kolo"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-04-player-waiting.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Konec kola - všichni hráči umístili své tipy (pohled tvůrce hry)</h4>
                    <p>
                        Kolo končí, když všichni hráči umístí svůj tip, nebo když vyprší odpočet kola. Výsledky kola se
                        zobrazí nalevo v panelu vedle panorama. Správce hry má poté za úkol spustit pro všechny hráče
                        další kolo.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled admina, který musí zahájit další kolo"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-05-admin-waiting.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Konec hry a zobrazení výsledků</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče na konci hry před zobrazením výsledků"
                            src={`${process.env.REACT_APP_WEB_URL}/multiplayer/multiplayer-06-player-show-results.png`}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};
