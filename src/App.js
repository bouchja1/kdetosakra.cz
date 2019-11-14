import React from 'react';
import ReactGA from 'react-ga';
import { Layout, Icon } from 'antd';
import * as Sentry from '@sentry/browser';

import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import RouterSwitch from './components/RouterSwitch';
import { MapyProvider } from './context/MapyContext';
import MenuComponent from './components/pageStructure/Menu';

const { Footer } = Layout;

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.pageview(window.location.pathname);
}

function App() {
    // init google analytics
    initializeReactGA();
    Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DNS });
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);

    return (
        <>
            <MenuComponent />
            <Layout className="layout">
                {loaded && !error && (
                    <MapyProvider value={mapLoader}>
                        <RouterSwitch />
                    </MapyProvider>
                )}
                <Footer style={{ textAlign: 'center' }}>
                    Postaveno na <a href="http://mapy.cz/">Mapy.cz</a> <a href="https://api.mapy.cz/">API</a>{' '}
                    <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />
                </Footer>
            </Layout>
        </>
    );
}

export default App;
