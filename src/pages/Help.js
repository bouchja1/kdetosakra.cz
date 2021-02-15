import React from 'react';
import { Layout, Image } from 'antd';
import { Link } from 'react-router-dom';

const { Content } = Layout;

export const Help = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>Nápověda</h2>
                <h3>Princip hry a bodování</h3>
                <p>
                    Hra nabízí čtyři herní módy. Cílem hry je vypátrat v pěti kolech polohu pěti různých míst v České
                    republice. Pátrání začínáš v náhodně generovaném panoramatickém snímku a v přiložené mapě se snažíš
                    s co nejvyšší přesností určit, kde (v panoramatu) se právě nacházíš.
                </p>
                <p>Čím blíž svůj odhad na mapě umístíš, tím víc bodů v herním kole získáváš.</p>
                <p>
                    Pokud si vybereš jiný herní mód než
                    {' '}
                    <Link
                        to={{
                            pathname: '/nahodne',
                        }}
                    >
                        Náhodné místo v Česku
                    </Link>
                    , hra předpokládá, že vybrané okolí alespoň trochu znáš. Proto je za nepřesný odhad vyšší bodová
                    penalizace než u náhodně generovaného místa.
                </p>
                <ul>
                    <li>
                        Pro zisk alespoň nějakých bodů musí být tvůj tip v okolí maximálně 250 km od hádaného místa (v
                        případě hádání náhodného místa v Čr), respektive v okolí maximálně 2 km plus na začátku zvolený
                        kilometrový radius (pro ostatní módy).
                    </li>
                    <li>100 % (= 100 bodů) získáš, když se trefíš ne dál než 20 metrů od hádaného místa.</li>
                </ul>
                <p>
                    Hádání není časově omezeno. Pro přesnější odhad a lepší výsledek se můžeš v panoramatu libovolně
                    pohybovat. Dostaneš se tak třeba na místo, které je ti povědomé. Nebo spatříš jméno města na
                    billboardu. Nebo &quot;dojedeš&quot; až k ceduli s názvem obce... nebo si vypracuješ vlastní
                    unikátní herní strategii.
                </p>
                <h3 id="how-to-multiplayer">Jak hrát multiplayer mód</h3>
                <div className="tutorial-section">
                    <h4>Vytvoření hry pro více hráčů</h4>
                    <p>
                        K vytvoření hry pro více hráčů a jejímu hraní není nutná registrace. Tvůrce hry (ten, co chce
                        pozvat ke hře jiné hráče) vybere jeden z herních módů a jako typ hry zvolí &quot;Hrát s
                        přáteli&quot;. V následujícím dialogu vygeneruje pozvánku a získá unikátní odkaz, který si
                        zkopíruje a zašle jej dalším hráčům. Může pozvat až 4 další hráče. Hráči si otevřou zaslaný
                        odkaz v prohlížeči a všichni se octnou ve společné herní místnosti (viz dále).
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer - získání odkazu"
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-00-admin.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Nastavení hry před začátkem hádání (pohled tvůrce hry)</h4>
                    <p>
                        Hráč, který vytvářel pozvánku, se stává správcem hry. Před začátkem prvního kola může změnit
                        hodnotu odpočtu (v sekundách), který začné ihned poté, co nejrychlejší hráč daného kola umístí
                        svůj tip. Výchozí hodnota odpočtu je nastavena na 60 sekund. Jakmile jsou všichni hráči
                        připraveni, správce spouští hru.
                    </p>
                    <p>
                        Hru je možné spustit i bez čekání na potvrzení všech hráčů. Ti, kteří nepotvrdili, že jsou
                        připraveni ke hře, budou ale ze hry odebráni.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled admina"
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-01-admin.png`}
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
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-02-player-not-ready.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Hráč umístil tip jako první</h4>
                    <p>
                        Po umístění tipu nejrychlejšího hráče začíná odpočet zbývajících sekund do konce kola. Ostatní
                        hráči si musí pospíšit a umístit své tipy dřív než čas vyprší, jinak v tomto kole získávají 0
                        bodů. Počet získaných bodů
                        {' '}
                        <b>nezáleží</b>
                        {' '}
                        na rychlosti umístění tipu ani pořadí umístění tipu.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče, který umístil tip jako první"
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-03-player-guessed.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Konec kola - všichni hráči umístili své tipy (pohled pozvaného hráče)</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče, který čeká na další kolo"
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-04-player-waiting.png`}
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
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-05-admin-waiting.png`}
                        />
                    </div>
                </div>
                <div className="tutorial-section">
                    <h4>Konec hry a zobrazení výsledků</h4>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Image
                            alt="Multiplayer před zahájením hry - pohled hráče na konci hry před zobrazením výsledků"
                            width={750}
                            src={`${window._env_.REACT_APP_WEB_URL}/multiplayer/multiplayer-06-player-show-results.png`}
                        />
                    </div>
                </div>
            </div>
        </Content>
    );
};
