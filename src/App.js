import React from 'react';
import useScript from './hooks/useScript';
import logo from './logo.svg';
import './App.css';

function App() {
    const [loaded, error] = useScript('https://api.mapy.cz/loader.js');

    /*
    const loadPanorama = () => {
        const options = {
            nav: false, // skryjeme navigaci
            pitchRange: [0, 0], // zakazeme vertikalni rozhled
        };
        const panoramaScene = new SMap.Pano.Scene(document.querySelector('.panorama'), options);
        // kolem teto pozice chceme nejblizsi panorama
        var position = SMap.Coords.fromWGS84(14.4297652, 50.0753929);

        // hledame s toleranci 50m
        SMap.Pano.getBest(position, 50).then(
            function(place) {
                panoramaScene.show(place);
            },
            function() {
                alert('Panorama se nepodařilo zobrazit!');
            },
        );
    };

     */

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div>
                    Script loaded: <b>{loaded.toString()}</b>
                </div>
                {loaded && !error && (
                    <div>
                        Script function call response: <b>{Loader.load(null, { pano: true })}</b>
                    </div>
                )}
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
                <div className="panorama"></div>
            </header>
        </div>
    );
}

export default App;
