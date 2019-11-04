import React from 'react';
import useScript from './hooks/useScript';
import './App.css';

import Panorama from './components/Panorama';

function App() {
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <Panorama/>
                )}
            </header>
        </div>
    );
}

export default App;
