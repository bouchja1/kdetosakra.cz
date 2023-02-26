import './services/firebase';

import { CoffeeOutlined, HeartTwoTone } from '@ant-design/icons';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Layout } from 'antd';
import React from 'react';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import Menu from './components/Menu';
import RouterSwitch from './components/RouterSwitch';
import { MapyCzProvider } from './context/MapyCzContext';
import useMapLoader from './hooks/useMapLoader';
import useScript from './hooks/useScript';
import store, { persistor } from './redux/store';

const { Footer } = Layout;

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
}

function MainApp(props) {
    // init google analytics
    if (process.env.NODE_ENV === 'production') {
        initializeReactGA();
    }
    if (process.env.REACT_APP_SENTRY_DNS) {
        Sentry.init({
            dsn: process.env.REACT_APP_SENTRY_DNS,
            integrations: [new BrowserTracing()],
            environment: process.env.NODE_ENV,
            // We recommend adjusting this value in production, or using tracesSampler for finer control
            tracesSampleRate: 0.3,
        });
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
                            Postaveno s <HeartTwoTone twoToneColor="#eb2f96" /> na{' '}
                            <a href="https://api.mapy.cz/">Mapy.cz API</a>{' '}
                            {!pathname.includes('info') && (
                                <>
                                    {' | '}
                                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                    <a href="https://www.buymeacoffee.com/mmwbwdq" target="_blank" rel="noreferrer">
                                        Kup mi kafe - podpoříš provoz a další rozvoj <CoffeeOutlined />
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

function App() {
    return <MainApp />;
}

export default App;
