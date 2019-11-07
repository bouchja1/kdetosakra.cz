import React from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import Panorama from "../Panorama";

const SuggestedCity = () => {
    const location = useLocation();

    if (location && location.state && location.state.city) {
        return (
            <>
                <div className="game-mode-info-container">
                    <h2>Herní mód: Zvolené místo v Čr</h2>
                    <h3>Místo: {location.state.city.place}</h3>
                    {location.state.city.info ? <h3>{location.state.city.info}</h3> : null}
                    <Link to="/">Zpět do výběru herního módu</Link>
                </div>
                <div className='panorama-container'>
                    <Panorama location={location}/>
                </div>
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

export default SuggestedCity;
