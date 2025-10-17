import { Layout } from 'antd';
import React from 'react';
import { useLocation } from 'react-router';

const { Content } = Layout;

export const NotFound = () => {
    const location = useLocation();

    return (
        <Content>
            <h1>
                Takovou adresu tady nemám:
                {location.pathname}
            </h1>
        </Content>
    );
};
