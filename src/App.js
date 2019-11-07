import React from 'react';
import ReactGA from 'react-ga';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import './App.css';

import RouterSwitch from './components/RouterSwitch';
import {MapyProvider} from './context/MapyContext';

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
        <div className="App">
            {loaded && !error && (
                <MapyProvider value={mapLoader}>
                    <RouterSwitch/>
                </MapyProvider>
            )}
        </div>
    );
}

export default App;
