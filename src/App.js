import React from 'react';
import useScript from './hooks/useScript';
import useMapLoader from './hooks/useMapLoader';
import './App.css';

import Panorama from './components/Panorama';
import { MapyProvider } from './context/MapyContext';

function App() {
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');
    const [mapLoader] = useMapLoader(loaded);

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <MapyProvider value={mapLoader}>
                        <Panorama loadedMapApi={mapLoader.loadedMapApi}/>
                    </MapyProvider>
                )}
            </header>
        </div>
    );
}

export default App;
