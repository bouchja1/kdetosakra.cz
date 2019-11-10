import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import awesomeLogo from './assets/images/kdetosakra.png'; // Tell Webpack this JS file uses this image
import socialIcons from './assets/images/social-icons.svg';

import RouterSwitch from './components/RouterSwitch';
import { MapyProvider } from './context/MapyContext';
import Menu from './components/pageStructure/Menu';
import Footer from './components/pageStructure/Footer';

function initializeReactGA() {
    ReactGA.initialize('UA-151784741-1');
    ReactGA.pageview(window.location.pathname);
}

function App() {
    // init google analytics
    initializeReactGA();
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);

    return (
        <div className="kdetosakra-container">
            <Menu />
            {loaded && !error && (
                <MapyProvider value={mapLoader}>
                    <RouterSwitch />
                </MapyProvider>
            )}
            <Footer />
        </div>
    );
}

export default App;
