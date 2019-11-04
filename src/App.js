import React from 'react';
import useScript from './hooks/useScript';
import logo from './logo.svg';
import './App.css';

import Panorama from './components/Panorama';

function App() {
    const [loaded, error, SMap] = useScript('https://api.mapy.cz/loader.js');

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <Panorama SMap={SMap}/>
                )}
            </header>
        </div>
    );
}

export default App;
