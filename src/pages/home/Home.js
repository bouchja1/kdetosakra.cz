import React from 'react';
import { Layout } from 'antd';
import Configuration from '../../components/Configuration';

const { Content } = Layout;

const Home = ({ processHeaderContainerVisible }) => {
    return (
        <Content>
            <Configuration processHeaderContainerVisible={processHeaderContainerVisible} />;
        </Content>
    );
};

export default Home;
