import React from 'react';
import ReactGA from 'react-ga';
import { Layout } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import * as Sentry from '@sentry/browser';

import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import RouterSwitch from './components/RouterSwitch';
import { KdetosakraProvider } from './context/KdetosakraContext';
import Menu from './components/Menu';

const { Footer } = Layout;

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

    return (
        <>
            <Menu />
            <Layout className="layout">
                {loaded && !error && (
                    <KdetosakraProvider value={mapLoader}>
                        <RouterSwitch />
                    </KdetosakraProvider>
                )}
                <Footer style={{ textAlign: 'center' }}>
                    Postaveno na
                    {' '}
                    <a href="https://api.mapy.cz/">Mapy.cz API</a>
                    {' '}
                    <HeartTwoTone twoToneColor="#eb2f96" />
                </Footer>
            </Layout>
        </>
    );
}

export default App;
