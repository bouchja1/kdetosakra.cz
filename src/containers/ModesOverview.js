import React from 'react';
import { Card } from 'antd';
import {
    CustomPlace, RegionCity, RandomCity, Geolocation
} from '../components/modes';
import pragueCover from '../assets/images/city/prague.jpg';
import randomCover from '../assets/images/city/random.jpg';
import suggestedCover from '../assets/images/city/suggested.jpg';
import geolocationCover from '../assets/images/city/geolocation.jpg';
import youtubeCover from '../assets/images/youtube.jpg';
import useSMapResize from '../hooks/useSMapResize';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';

export const ModesOverview = () => {
    useGetRandomUserToken();
    const { width } = useSMapResize();

    const isMultiplayerSupported = width > 599;

    return (
        <>
            <Card cover={<img alt="Herní mód - Krajská města ČR" src={pragueCover} />}>
                <h1>Krajská města ČR</h1>
                <p>
                    Bydlíš v některém z krajských sídel a znáš ho jako své boty? Tak se ukaž. Nebo se prostě jen tak
                    projdi po místech, která zase až tak dobře neznáš. Třeba objevíš zákoutí, kam se budeš chtít podívat
                    i naživo.
                </p>
                <RegionCity multiplayerSupported={isMultiplayerSupported} />
            </Card>
            <Card cover={<img alt="Herní mód - Náhodné místo v Česku" src={randomCover} />}>
                <h1>Náhodné místo v Česku</h1>
                <p>
                    Známá města a místa pro tebe nejsou dostatečnou výzvou? Můžeš se přenést do některé z
                    {' '}
                    <a href="https://github.com/33bcdd/souradnice-mest">6259 obcí ČR</a>
                    {' '}
                    a jejího bezprostředního okolí.
                    V každém kole na tebe čeká jiné náhodné místo v naší republice. Tahle výzva je (nejen) pro experty,
                    co mají ČR projetou křížem krážem.
                </p>
                <RandomCity multiplayerSupported={isMultiplayerSupported} />
            </Card>
            <Card cover={<img alt="Herní mód - Vlastní místo" src={suggestedCover} />}>
                <h1>Vlastní místo</h1>
                <p>
                    Krajská města už máš prochozená a náhodné toulky po ČR tě nebaví? Tak přesně tohle je výzva pro
                    tebe. Své město, obec či jiné zajímavé místo, které chceš více prozkoumat, si najdi níže. Šťastnou
                    cestu!
                </p>
                <CustomPlace multiplayerSupported={isMultiplayerSupported} />
            </Card>
            <Card cover={<img alt="Herní mód - Podle mojí geolokace" src={geolocationCover} />}>
                <h1>Podle mojí geolokace</h1>
                <p>
                    Nech zaměřit polohu svého zařízení a ukaž, kdo je tady pánem a znalcem svého bezprostředního okolí!
                </p>
                <Geolocation />
            </Card>
            {/* source: https://similarpng.com/youtube-player-video-preumim-vector-png */}
            <Card cover={<img alt="Herní mód - Videa" src={youtubeCover} />}>
                <h1>Let&apos;s play videa</h1>
                <p>
                    Dneska se ti nechce nikam klikat? Tak se můžeš jen koukat... a hraní nechat na druhých. Komunita
                    skvělých fanoušků natáčí, komentuje a sdílí svá videa z toulání se po mapě na
                    {' '}
                    <b>YouTube</b>
                    .
                </p>
                <h3>YouTube kanály</h3>
                <ul className="video-list">
                    <li>
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                            href="https://www.youtube.com/playlist?list=PLtFesIeBF_meZrA0cGcPhMp_nUl79_AWI"
                            target="_blank"
                        >
                            Kdepak jsme?
                        </a>
                    </li>
                    <li>
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                            href="https://www.youtube.com/playlist?list=PLgtWt-mElPivScJgTABHu--vjAB9uOzxe"
                            target="_blank"
                        >
                            LakelyDorton
                        </a>
                    </li>
                </ul>
            </Card>
        </>
    );
};
