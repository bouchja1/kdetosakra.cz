import { Layout } from 'antd';
import React from 'react';

import { ModesOverview } from '../containers/ModesOverview';

const { Content } = Layout;

export const Home = () => {
    return (
        <Content>
            <ModesOverview />
        </Content>
    );
};
