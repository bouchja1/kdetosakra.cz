import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import awesomeLogo from './assets/images/kdetosakra.png'; // Tell Webpack this JS file uses this image
import socialIcons from './assets/images/social-icons.svg';

import RouterSwitch from './components/RouterSwitch';
import { MapyProvider } from './context/MapyContext';

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
            <div className="menu-container">
                <div className="menu">
                    <div className="date">
                        <Link to="/">Domů</Link>
                    </div>
                    <div className="links">
                        <div className="signup">Sign Up</div>
                        <div className="login">
                            <Link to="/info">O hře</Link>
                        </div>
                    </div>
                </div>
            </div>
            {loaded && !error && (
                <MapyProvider value={mapLoader}>
                    <RouterSwitch />
                </MapyProvider>
            )}
            <div className="footer">
                <div className="footer-item">
                    <p>Neco neco neco</p>
                </div>
            </div>
        </div>
    );
}

export default App;
