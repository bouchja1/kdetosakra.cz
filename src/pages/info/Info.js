import React, { useEffect } from 'react';
import { Typography, Icon, Layout } from 'antd';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Info = () => {
    function decryptEmail(encoded) {
        const address = atob(encoded);
        return `mailto:${address}`;
    }

    return (
        <Content>
            <Typography className="about-container">
                <Title>KdeToSakra.cz</Title>
                <Paragraph>
                    KdeToSakra.cz je český klon populární online zěměpisné hry GeoGuessr. Ta je založena na snímcích ze
                    služby Google Street View, zatímco KdeToSakra.cz využívá mapových podkladů aplikace Mapy.cz vyvíjené
                    společností Seznam. Hratelnost je takřka neomezená a jedinými limity jsou hranice České republiky.
                </Paragraph>
                <Paragraph>
                    Hra nabízí čtyři herní módy. V rámci vybraného módu je vaším úkolem poznat místo na území ČR a
                    následně toto místo označit na mapě. Čím blíž svůj odhad na mapě umístíte, tím víc bodů v herním
                    kole získáte. Hra předpokládá, že pokud si zvolíte jiný herní mód než "Náhodné místo v Česku",
                    hádané okolí alespoň trochu znáte, takže penalizace za větší vzdálenost je vyšší než u náhodně
                    vygenerovaného místa.
                </Paragraph>
                <Paragraph>
                    Hádání není časově omezeno. Pro přesnější odhad se tak můžete v panoramatu libovolně pohybovat a
                    "dojet" až na místo, které je vám povědomé. Nebo spatříte název místa na billboardu. Nebo "dojedete"
                    až k ceduli označující název obce.
                </Paragraph>
                <Paragraph>
                    Projekt jsem naprogramoval jako{' '}
                    <a href="https://github.com/bouchja1/kdetosakra.cz" target="_blank">
                        open-source
                    </a>{' '}
                    <Icon type="github" /> v rámci studia JavaScript knihovny React.js. Code reviews, pull requesty a
                    připomínky jsou víc než vítány!
                </Paragraph>
                <Paragraph>
                    Máte dotaz? Tak mi <a href={decryptEmail('amFuLmJvdWNobmVyQGdtYWlsLmNvbQ==')}>napiště</a>{' '}
                    <Icon type="mail" />.
                </Paragraph>
            </Typography>
        </Content>
    );
};

export default Info;
