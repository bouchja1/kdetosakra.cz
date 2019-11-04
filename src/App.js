import React from 'react';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import './App.css';

import Panorama from './components/Panorama';
import GuessingMap from './components/GuessingMap';
import { MapyProvider } from './context/MapyContext';

function App() {
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [loadedMapApi] = useMapLoader(loaded);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <MapyProvider value={loadedMapApi}>
                        <Panorama/>
                        <GuessingMap/>
                    </MapyProvider>
                )}
            </header>
        </div>
    );
}

export default App;
