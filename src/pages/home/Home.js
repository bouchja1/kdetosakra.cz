import React from 'react';
import { Layout } from 'antd';
import Configuration from '../../containers/Configuration';

const { Content } = Layout;

const Home = () => {
    return (
        <Content>
            <Configuration />
        </Content>
    );
};

export default Home;
