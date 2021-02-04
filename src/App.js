import React from 'react';
import ReactGA from 'react-ga';
import { Layout, Typography } from 'antd';
import { HeartTwoTone, CoffeeOutlined } from '@ant-design/icons';
import * as Sentry from '@sentry/browser';

import { useLocation } from 'react-router-dom';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import RouterSwitch from './components/RouterSwitch';
import { KdetosakraProvider } from './context/KdetosakraContext';
import Menu from './components/Menu';
import './services/firebase';

const { Footer } = Layout;
const { Text } = Typography;

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.pageview(window.location.pathname);
}

function App() {
    // init google analytics
    initializeReactGA();
    if (window._env_.REACT_APP_SENTRY_DNS) {
        Sentry.init({ dsn: window._env_.REACT_APP_SENTRY_DNS });
    }
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);
    const location = useLocation();

    const { pathname } = location;

    return (
        <>
            <Menu />
            <Layout className="layout">
                {loaded && !error && (
                    <KdetosakraProvider value={mapLoader}>
                        <RouterSwitch />
                    </KdetosakraProvider>
                )}
                <Footer style={{ textAlign: 'center', fontSize: '14px' }}>
                    <Text>
                        Postaveno s
                        {' '}
                        <HeartTwoTone twoToneColor="#eb2f96" />
                        {' '}
                        na
                        {' '}
                        <a href="https://api.mapy.cz/">Mapy.cz API</a>
                        {' '}
                    </Text>
                    {!pathname.includes('info') && (
                        <>
                            {' | '}
                            <Text>
                                <a href="https://www.buymeacoffee.com/mmwbwdq" target="_blank">
                                    Kup mi kafe - podpoříš provoz a další vývoj
                                    {' '}
                                    <CoffeeOutlined />
                                </a>
                            </Text>
                        </>
                    )}
                </Footer>
            </Layout>
        </>
    );
}

export default App;
