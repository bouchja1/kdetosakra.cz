import './services/firebase';

import { HeartTwoTone } from '@ant-design/icons';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Layout } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Provider } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import Menu from './components/Menu';
import { NewGameModeHelp } from './components/NewGameModeHelp';
import RouterSwitch from './components/RouterSwitch';
import { isInGameRoute, routeNames } from './constants/routes';
import { MapyCzProvider } from './context/MapyCzContext';
import useMapLoader from './hooks/useMapLoader';
import useScript from './hooks/useScript';
import store, { persistor } from './redux/store';

const { Footer } = Layout;

export const App = () => {
    // init google analytics
    if (process.env.NODE_ENV === 'production') {
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
                {!isMobile && !isInGame && <NewGameModeHelp />}
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
                            <a href="https://api.mapy.cz/">Mapy.cz API</a>
                            {' | '}
                            {/* eslint-disable-next-line react/jsx-no-target-blank */}
                            <Link to={`/${routeNames.podminky}`}>Podmínky</Link>
                            {' | '}
                            {/* eslint-disable-next-line react/jsx-no-target-blank */}
                            <Link to={`/${routeNames.cookies}`}>Cookies</Link>
                            {' | '}
                            {/* eslint-disable-next-line react/jsx-no-target-blank */}
                            Koukněte i na můj další projekt{' '}
                            <a href="https://zenamu.com" target="_blank" rel="noreferrer">
                                Zenamu
                            </a>{' '}
                            - rezervační systém pro jóga studia
                        </p>
                    </Footer>
                )}
            </PersistGate>
        </Provider>
    );
};
