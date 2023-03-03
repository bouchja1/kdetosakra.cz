import { Layout } from 'antd';
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
            </div>
            <Content>
                <ModesOverview />
            </Content>
        </div>
    );
};
