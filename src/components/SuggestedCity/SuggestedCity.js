import React, { useEffect } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import Game from '../Game';

const SuggestedCity = ({ processHeaderContainerVisible }) => {
    const location = useLocation();

    useEffect(() => {
        processHeaderContainerVisible(false);
    }, []);

    if (location && location.state && location.state.city) {
        return (
            <>
                <div className="game-mode-info-container">
                    <h2>Herní mód: Zvolené místo v Čr</h2>
                    <h3>Místo: {location.state.city.place}</h3>
                    {location.state.city.info ? <h3>{location.state.city.info}</h3> : null}
                    <Link to="/">Zpět do výběru herního módu</Link>
                </div>
                <Game location={location} />
            </>
        );
    } else {
        return (
            <Redirect
                to={{
                    pathname: '/',
                }}
            />
        );
    }
};

export default SuggestedCity;
