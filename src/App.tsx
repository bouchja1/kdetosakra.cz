import './services/firebase';

import { CoffeeOutlined, HeartTwoTone } from '@ant-design/icons';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import ReactGA from 'react-ga4';
import { Provider } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import Menu from './components/Menu';
import RouterSwitch from './components/RouterSwitch';
import { isInGameRoute, routeNames } from './constants/routes';
import { MapyCzProvider } from './context/MapyCzContext';
import useMapLoader from './hooks/useMapLoader';
import useScript from './hooks/useScript';
import store, { persistor } from './redux/store';

const { Footer } = Layout;

const initializeReactGA = () => {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const App = () => {
    // init google analytics
    if (process.env.NODE_ENV === 'production') {
        initializeReactGA();
        if (process.env.REACT_APP_SENTRY_DNS) {
            Sentry.init({
                dsn: process.env.REACT_APP_SENTRY_DNS,
                integrations: [new BrowserTracing()],
                environment: process.env.NODE_ENV,
                // We recommend adjusting this value in production, or using tracesSampler for finer control
                tracesSampleRate: 0.3,
            });
        }
    }
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);
    const location = useLocation();
    const { pathname } = location;

    const isInGame = isInGameRoute(pathname);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Menu isInGame={isInGame} />
                <Layout className={classNames(!isInGame && 'layout')}>
                    {loaded && !error && (
                        <MapyCzProvider value={mapLoader}>
                            <RouterSwitch />
                        </MapyCzProvider>
                    )}
                </Layout>
                {!isInGame && (
                    <Footer style={{ textAlign: 'center', fontSize: '14px' }}>
                        <p>
                            Postaveno s <HeartTwoTone twoToneColor="#eb2f96" /> na{' '}
                            <a href="https://api.mapy.cz/">Mapy.cz API</a>{' '}
                            {!pathname.includes(routeNames.info) && !pathname.includes(routeNames.podpora) && (
                                <>
                                    {' | '}
                                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                    <Link to={`/${routeNames.podpora}`}>
                                        Podpořte provoz a další rozvoj <CoffeeOutlined />
                                    </Link>
                                </>
                            )}
                        </p>
                    </Footer>
                )}
            </PersistGate>
        </Provider>
    );
};
