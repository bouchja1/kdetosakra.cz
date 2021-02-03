import React from 'react';
import { Layout } from 'antd';
import Configuration from '../containers/Configuration';

const { Content } = Layout;

export const Home = () => {
    return (
        <Content>
            <Configuration />
        </Content>
    );
};
