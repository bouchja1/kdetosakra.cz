import React from 'react';
import HeaderContainer from '../../components/pageStructure/HeaderContainer';

const Info = () => {
    function decryptEmail(encoded) {
        const address = atob(encoded);
        return `mailto:${address}`;
    }

    return (
        <>
            <HeaderContainer />
            <div className="about-container">
                <div className="about">
                    <h1>KdeToSakra.cz</h1>
                    <p>
                        KdeToSakra.cz je český klon populární online zěměpisné hry GeoGuessr. Ta je založena na snímcích
                        ze služby Google Street View, zatímco KdeToSakra.cz využívá mapových podkladů aplikace Mapy.cz
                        vyvíjené společností Seznam. Hratelnost je takřka neomezená a jedinými limity jsou hranice České
                        republiky.
                    </p>
                    <p>
                        Hra nabízí čtyři herní módy. V rámci vybraného módu je vaším úkolem poznat místo na území ČR a
                        následně toto místo označit na mapě. Čím blíž svůj odhad na mapě umístíte, tím víc bodů v herním
                        kole získáte. Hra předpokládá, že pokud si zvolíte jiný herní mód než "Náhodné místo v Česku",
                        hádané okolí alespoň trochu znáte, takže penalizace za větší vzdálenost je vyšší než u náhodně
                        vygenerovaného místa.
                    </p>
                    <p>
                        Hádání není časově omezeno. Pro přesnější odhad se tak můžete v panoramatu libovolně pohybovat a
                        "dojet" až na místo, které je vám povědomé. Nebo spatříte název místa na billboardu. Nebo
                        "dojedete" až k ceduli označující název obce.
                    </p>
                    <p>
                        Projekt jsem naprogramoval jako{' '}
                        <a href="https://github.com/bouchja1/kdetosakra.cz" target="_blank">
                            open-source
                        </a>{' '}
                        v rámci studia JavaScript knihovny React.js. Code reviews, pull requesty a připomínky jsou víc
                        než vítány!
                    </p>
                    <p>
                        Máte dotaz? Tak mi <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napiště</a>
                    </p>
                    .
                </div>
            </div>
        </>
    );
};

export default Info;
