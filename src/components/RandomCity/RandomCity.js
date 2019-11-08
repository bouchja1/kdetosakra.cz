import React from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import Game from "../Game";

const RandomCity = () => {
    const location = useLocation();

    if (location && location.state && location.state.mode === 'random') {
        return (
            <>
                <div className="game-mode-info-container">
                    <h2>Herní mód: Náhodné místo v Čr</h2>
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

export default RandomCity;
