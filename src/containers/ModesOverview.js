import React, { useState } from 'react';
import { Card, Radio, Select } from 'antd';
import {
    CustomPlace, RegionCity, Random, Geolocation, RandomPlaceInRegion
} from '../components/modes';
import pragueCover from '../assets/images/city/prague.jpg';
import randomCover from '../assets/images/city/random.jpg';
import suggestedCover from '../assets/images/city/suggested.jpg';
import geolocationCover from '../assets/images/city/geolocation.jpg';
import youtubeCover from '../assets/images/youtube.jpg';
import useSMapResize from '../hooks/useSMapResize';
import { nutsCodes } from '../enums/nutsCodes';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';

const { Option } = Select;

export const ModesOverview = () => {
    useGetRandomUserToken();
    const { width } = useSMapResize();
    const [randomMode, setRandomMode] = useState('cr');
    const [regionNutCode, setRegionNutCode] = useState(null);

    const isMultiplayerSupported = width > 599;

    const handleRandomModeChange = e => {
        setRandomMode(e.target.value);
    };

    const regionEnumKeys = Object.keys(nutsCodes);

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
            <Card cover={<img alt="Herní mód - Náhodné místo" src={randomCover} />}>
                <h1>Náhodné místo</h1>
                <div className="randomPlace__modes">
                    <Radio.Group value={randomMode} onChange={handleRandomModeChange}>
                        <Radio.Button value="cr">celá ČR</Radio.Button>
                        <Radio.Button value="nut">kraj</Radio.Button>
                    </Radio.Group>
                </div>
                {randomMode === 'cr' ? (
                    <>
                        <p>
                            Známá města a místa pro tebe nejsou dostatečnou výzvou? Můžeš se přenést do některé z
                            {' '}
                            <a href="https://github.com/33bcdd/souradnice-mest">6259 obcí ČR</a>
                            {' '}
                            a jejího
                            bezprostředního okolí. V každém kole na tebe čeká jiné náhodné místo v naší republice. Tahle
                            výzva je (nejen) pro experty, co mají ČR projetou křížem krážem.
                        </p>
                        <Random multiplayerSupported={isMultiplayerSupported} />
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: '10px' }}>
                            <p>
                                Pokud je ti krajské město malé, ale zároveň se nechceš tak úplně ztratit, zvol si jeden
                                ze
                                {' '}
                                <b>14 krajů</b>
                                {' '}
                                v Česku a zase máš co objevovat.
                            </p>
                            <div className="randomPlace__modes">
                                <label htmlFor="city">Kraj: </label>
                                <Select
                                    showSearch
                                    name="city"
                                    style={{ width: 200 }}
                                    placeholder="zvolit kraj"
                                    onChange={value => {
                                        setRegionNutCode(value);
                                    }}
                                >
                                    {regionEnumKeys.map(key => {
                                        const { code, name } = nutsCodes[key];
                                        return <Option value={code}>{name}</Option>;
                                    })}
                                </Select>
                            </div>
                        </div>
                        <RandomPlaceInRegion
                            multiplayerSupported={isMultiplayerSupported}
                            regionNutCode={regionNutCode}
                        />
                    </>
                )}
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
                            rel="noopener noreferrer"
                        >
                            Kdepak jsme?
                        </a>
                    </li>
                    <li>
                        {/* eslint-disable-next-line react/jsx-no-target-blank */}
                        <a
                            href="https://www.youtube.com/playlist?list=PLgtWt-mElPivScJgTABHu--vjAB9uOzxe"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            LakelyDorton
                        </a>
                    </li>
                </ul>
            </Card>
        </>
    );
};
