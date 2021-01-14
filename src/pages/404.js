import React from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router';

const { Content } = Layout;

const NotFound = () => {
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

export default NotFound;
