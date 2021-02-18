import './services/firebase';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import { Layout } from 'antd';
import { HeartTwoTone, CoffeeOutlined } from '@ant-design/icons';
import * as Sentry from '@sentry/browser';
import { useLocation } from 'react-router-dom';

import store, { persistor } from './redux/store';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import RouterSwitch from './components/RouterSwitch';
import { MapyCzProvider } from './context/MapyCzContext';
import Menu from './components/Menu';
import withClearCache from './ClearCache';

const { Footer } = Layout;

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.pageview(window.location.pathname);
}

function MainApp(props) {
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
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Menu />
                <Layout className="layout">
                    {loaded && !error && (
                        <MapyCzProvider value={mapLoader}>
                            <RouterSwitch />
                        </MapyCzProvider>
                    )}
                    <Footer style={{ textAlign: 'center', fontSize: '14px' }}>
                        <p>
                            Postaveno s
                            {' '}
                            <HeartTwoTone twoToneColor="#eb2f96" />
                            {' '}
                            na
                            {' '}
                            <a href="https://api.mapy.cz/">Mapy.cz API</a>
                            {' '}
                            {!pathname.includes('info') && (
                                <>
                                    {' | '}
                                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                    <a href="https://www.buymeacoffee.com/mmwbwdq" target="_blank" rel="noreferrer">
                                        Kup mi kafe - podpoříš provoz a další rozvoj
                                        {' '}
                                        <CoffeeOutlined />
                                    </a>
                                </>
                            )}
                        </p>
                    </Footer>
                </Layout>
            </PersistGate>
        </Provider>
    );
}

const ClearCacheComponent = withClearCache(MainApp);

function App() {
    return <MainApp />;
}

export default App;
