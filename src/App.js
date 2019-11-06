import React from 'react';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import './App.css';

import RouterSwitch from './components/RouterSwitch';
import { MapyProvider } from './context/MapyContext';

function App() {
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);

    return (
        <div className="App">
            <header className="App-header">
                {loaded && !error && (
                    <MapyProvider value={mapLoader}>
                        <RouterSwitch />
                    </MapyProvider>
                )}
            </header>
        </div>
    );
}

export default App;
