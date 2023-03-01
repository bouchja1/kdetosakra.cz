import { Layout } from 'antd';
import React from 'react';

import { Donate } from '../components/Donate';

const { Content } = Layout;

export const DonationPage = () => {
    return (
        <Content>
            <div className="about-container">
                <h2>Podpora 🙏</h2>
                <Donate marginBottom={100} />
            </div>
        </Content>
    );
};
