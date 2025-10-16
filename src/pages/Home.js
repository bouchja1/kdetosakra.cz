import { FacebookFilled, InstagramFilled } from '@ant-design/icons';
import { Alert, Layout } from 'antd';
import React from 'react';

import { ModesOverview } from '../containers/ModesOverview';

const { Content } = Layout;

export const Home = () => {
    return (
        <div className="home-overview">
            <div className="home-overview-hero">
                <h1>Poznávej Česko!</h1>
                <p>Toulej se v panorámatech a hádej, kde se právě nacházíš.</p>

                <p className="subtitle">
                    Žádná věda... česká obdoba kultovního <b>GeoGuessr</b>
                </p>

                <Alert
                    message="Loučíme se, ale víme, kde to sakra bylo! ❤️"
                    description='6 let, 1 země, nespočet „Vysočin". Po šesti letech a tisících uhodnutých (i totálně přestřelených) míst se KdeToSakra.cz pomalu loučí — ale stylově, jako poslední tour po Česku.'
                    type="error"
                    closable={false}
                    className="farewell-alert"
                />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', gap: '1rem' }}>
                    <div>
                        <div className="menu-item menu-separator">|</div>
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
                    </div>
                    <div>
                        <div className="menu-item menu-separator">|</div>
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
                </div>
            </div>
            <Content>
                <ModesOverview />
            </Content>
        </div>
    );
};
