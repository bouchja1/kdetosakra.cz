import { FacebookFilled, InstagramFilled } from '@ant-design/icons';
import { Alert, Layout, Tooltip } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

import { InstagramCarousel } from '../components/InstagramCarousel';
import { routeNames } from '../constants/routes';
import { ModesOverview } from '../containers/ModesOverview';

const { Content } = Layout;

export const Home = () => {
    return (
        <div className="home-overview">
            <div className="home-overview-hero">
                <h1>Poznávej Česko!</h1>

                <Tooltip
                    title={
                        <>
                            Žádná věda... česká obdoba kultovního <b>GeoGuessr</b>
                        </>
                    }
                    placement="right"
                >
                    <p className={!isMobile ? 'tooltip-text' : undefined}>
                        Toulej se v panorámatech a hádej, kde se právě nacházíš.
                    </p>
                </Tooltip>

                <Alert
                    message="Loučíme se, ale víme, kde to sakra bylo! ❤️"
                    description={
                        <>
                            <div style={{ marginBottom: '7px' }}>
                                <ul>
                                    <li>
                                        <Link to={`/${routeNames.endIsNear}`}>
                                            Provoz kdetosakra.cz bude v prosinci 2025 ukončen.
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="https://developer.mapy.com/cs/js-api/ukonceni-podpory-js-sdk"
                                            target="_blank"
                                        >
                                            Od května 2025 už se ve hře objevují dočasné výpadky (pano se nenačte).
                                        </a>{' '}
                                        Bohužel, nedá se s tím nic dělat.
                                    </li>
                                </ul>
                            </div>
                            <div>
                                6 let, 1 země, nespočet „Vysočin". Po šesti letech a tisících uhodnutých (i totálně
                                přestřelených) míst se KdeToSakra.cz pomalu loučí — ale stylově, jako{' '}
                                <a href="https://www.instagram.com/kdetosakra/" target="_blank">
                                    poslední tour po Česku.
                                </a>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    gap: '1.5rem',
                                    marginTop: '15px',
                                }}
                            >
                                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                <div>
                                    <a
                                        title="Facebook stránka"
                                        href="https://www.facebook.com/kdetosakra.cz"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <FacebookFilled style={{ color: 'rgb(66, 103, 178)', fontSize: '25px' }} />
                                    </a>
                                </div>
                                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                <div>
                                    <a
                                        title="Instagram stránka"
                                        href="https://www.instagram.com/kdetosakra/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <InstagramFilled style={{ color: 'rgb(126,125,125)', fontSize: '25px' }} />
                                    </a>
                                </div>
                            </div>
                        </>
                    }
                    type="error"
                    closable={false}
                    className="farewell-alert"
                />

                <InstagramCarousel />
            </div>
            <Content>
                <ModesOverview />
            </Content>
        </div>
    );
};
