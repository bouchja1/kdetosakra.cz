import React from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import Game from "../Game";

const Geolocation = () => {
    const location = useLocation();

    if (location && location.state && location.state.radius && location.state.city) {
        return (
            <>
                <div className="game-mode-info-container">
                    <h2>Herní mód: Podle aktuální geolokace</h2>
                    <h3>Maximální vzdálenost od místa: {location.state.radius} km</h3>
                    <Link to="/">Zpět do výběru herního módu</Link>
                </div>
                <Game location={location} />
            </>
        );
    } else {
        return <Redirect
            to={{
                pathname: '/',
            }}
        />
    }
};

export default Geolocation;
