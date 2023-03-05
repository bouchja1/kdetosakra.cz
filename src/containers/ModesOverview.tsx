import { Card, Radio, RadioChangeEvent, Select } from 'antd';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import appleAndroid from '../assets/images/apple-android.png';
import geolocationCover from '../assets/images/city/geolocation.jpg';
import heraldryCover from '../assets/images/city/heraldry.png';
import pragueCover from '../assets/images/city/prague.jpg';
import randomCover from '../assets/images/city/random.jpg';
import suggestedCover from '../assets/images/city/suggested.jpg';
import youtubeCover from '../assets/images/youtube.jpg';
import { GameModeRibbonWrapper } from '../components/GameModeRibbonWrapper';
import { CustomPlace, Geolocation, Random, RandomPlaceInRegion, RegionCity } from '../components/modes';
import { AmazingPlaces } from '../components/modes/AmazingPlaces';
import { Heraldry } from '../components/modes/Heraldry';
import { routeNames } from '../constants/routes';
import { CATEGORIES } from '../enums/gaCategories';
import { nutsCodes } from '../enums/nutsCodes';
import useGetRandomUserToken from '../hooks/useGetRandomUserToken';
import useSMapResize from '../hooks/useSMapResize';
import { GameModes } from '../types/game';
import { borderRadiusBase, componentBackground } from '../util/theme';

const { Meta } = Card;
const { Option } = Select;

const ModesContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 25px;
    margin-bottom: 50px;
    flex: 0 0 100%; /* Let it fill the entire space horizontally */
`;

export const SectionModesContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    background: ${componentBackground};
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: ${borderRadiusBase};
    padding: 15px 30px 15px 30px;
`;

const SectionModeCards = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 15px;
    gap: 50px;
`;

export const ModesOverview = () => {
    useGetRandomUserToken();
    const { width } = useSMapResize();
    let history = useHistory();
    const [randomMode, setRandomMode] = useState('cr');
    const [regionNutCode, setRegionNutCode] = useState(null);

    const isMultiplayerSupported = width > 599;

    const handleRandomModeChange = (e: RadioChangeEvent) => {
        setRandomMode(e.target.value);
    };

    const regionEnumKeys = Object.keys(nutsCodes);

    const panoramaModesArray: GameModes[] = useMemo(() => {
        return [
            {
                coverImgAlt: 'Herní mód - Vlastní místo',
                coverImgSrc: suggestedCover,
                title: 'Vlastní místo',
                content: (
                    <>
                        <p>
                            Zahraj si tam, kde to dobře znáš. Vyhledej své město, obec či jiné zajímavé místo, jehož
                            okolí chceš blíže prozkoumat, a vyraž na cestu!
                        </p>
                        <CustomPlace multiplayerSupported={isMultiplayerSupported} />
                    </>
                ),
            },
            {
                coverImgAlt: 'Herní mód - Náhodné místo',
                coverImgSrc: randomCover,
                title: 'Náhodné místo',
                content: (
                    <>
                        <div className="randomPlace__modes">
                            <Radio.Group value={randomMode} onChange={handleRandomModeChange} buttonStyle="solid">
                                <Radio.Button value="cr">celá ČR</Radio.Button>
                                <Radio.Button value="nut">kraj</Radio.Button>
                            </Radio.Group>
                        </div>
                        {randomMode === 'cr' ? (
                            <>
                                <p>
                                    Nech se přenést do jedné z 6259 obcí ČR a jejího blízkého okolí. V každém kole na
                                    tebe čeká jiné náhodné místo. Tahle hra je pro experty, co mají ČR projetou křížem
                                    krážem.
                                </p>
                                <Random multiplayerSupported={isMultiplayerSupported} />
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '10px' }}>
                                    <p>
                                        Krajské město už je ti malé, ale zároveň nechceš tak úplně bloudit? Vyber si
                                        jeden ze <b>14 krajů</b> v Česku a zase máš co objevovat.
                                    </p>
                                    <div className="randomPlace__modes">
                                        <label htmlFor="city">Kraj: </label>
                                        <Select
                                            size="large"
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="zvolit kraj"
                                            onChange={value => {
                                                setRegionNutCode(value);
                                            }}
                                        >
                                            {regionEnumKeys.map(key => {
                                                // @ts-ignore
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
                    </>
                ),
            },
            {
                coverImgAlt: 'Herní mód - Krajská města ČR',
                coverImgSrc: pragueCover,
                title: 'Krajská města ČR',
                content: (
                    <>
                        <p>
                            Virtuální procházka po jednom z krajských sídel. Vydej se na poznávačku krajských měst.
                            Třeba objevíš zákoutí, kam se budeš chtít podívat i naživo.
                        </p>
                        <RegionCity multiplayerSupported={isMultiplayerSupported} />
                    </>
                ),
            },
            {
                coverImgAlt: 'Herní mód - Podle mojí geolokace',
                coverImgSrc: geolocationCover,
                title: 'Podle mojí geolokace',
                content: (
                    <>
                        <p>
                            Zaměřit polohu svého zařízení a ukázat, kdo je pánem a znalcem svého bezprostředního okolí.
                            To zní jako plán!
                        </p>
                        <Geolocation />
                    </>
                ),
            },
        ];
    }, [randomMode, regionNutCode, isMultiplayerSupported]);

    const otherModesArray: GameModes[] = useMemo(() => {
        return [
            {
                coverImgAlt: 'Herní mód - Zajímavá místa v Česku',
                coverImgSrc: suggestedCover,
                title: 'Zajímavá místa v Česku',
                content: (
                    <>
                        <p>Hledáte tipy na výlety?</p>
                        <p>Zahrajte si poznávačku z výběru fotek</p>
                        <AmazingPlaces />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '15px',
                            }}
                        ></div>
                    </>
                ),
            },
            {
                coverImgAlt: 'Herní mód - Heraldika',
                coverImgSrc: heraldryCover,
                title: 'Erby měst a obcí v Česku',
                content: (
                    <>
                        <p>
                            Prověř své znalosti heraldiky a uhádni, který erb patří kterému městu nebo obci v Česku.
                            Zábavná výzva pro všechny, kteří se zajímají o historii a symboliku českých měst.
                        </p>
                        <Heraldry />
                    </>
                ),
            },
            {
                coverImgAlt: 'Herní mód - Videa',
                coverImgSrc: youtubeCover,
                title: "Let's play videa",
                content: (
                    <>
                        <p>
                            Dneska se ti nechce nikam klikat? Tak nech hraní na druhých a jen se koukej! Komunita
                            skvělých fanoušků natáčí, vtipně komentuje a sdílí svá videa z toulání se po mapě na{' '}
                            <b>YouTube</b>.
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
                    </>
                ),
            },
        ];
    }, [randomMode, regionNutCode, isMultiplayerSupported]);

    return (
        <>
            <ModesContainer>
                <SectionModesContainer>
                    <h1>Herní módy s panorámaty</h1>
                    <SectionModeCards>
                        {panoramaModesArray.map(mode => {
                            const { coverImgAlt, coverImgSrc, title, content, isNew } = mode;
                            return (
                                <GameModeRibbonWrapper condition={!!isNew} message="Novinka!">
                                    <Card
                                        cover={<img alt={coverImgAlt} src={coverImgSrc} style={{ opacity: 0.9 }} />}
                                        key={title}
                                    >
                                        <Meta title={title} description={content} />
                                    </Card>
                                </GameModeRibbonWrapper>
                            );
                        })}
                    </SectionModeCards>
                </SectionModesContainer>
                <SectionModesContainer>
                    <h1>Ostatní</h1>
                    <SectionModeCards>
                        {otherModesArray.map(mode => {
                            const { coverImgAlt, coverImgSrc, title, content, isNew } = mode;
                            return (
                                <GameModeRibbonWrapper condition={!!isNew} message="Novinka!">
                                    <Card
                                        cover={<img alt={coverImgAlt} src={coverImgSrc} style={{ opacity: 0.9 }} />}
                                        key={title}
                                    >
                                        <Meta title={title} description={content} />
                                    </Card>
                                </GameModeRibbonWrapper>
                            );
                        })}
                    </SectionModeCards>
                </SectionModesContainer>
            </ModesContainer>
        </>
    );
};
