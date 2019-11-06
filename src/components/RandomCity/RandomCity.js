import React from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import Panorama from "../Panorama";

const RandomCity = () => {
    const location = useLocation();

    if (location && location.state && location.state.city) {
        return (
            <div>
                <h2>Herní mód: Náhodné místo v Čr</h2>
                <Link to="/">Zpět do výběru herního módu</Link>
                <Panorama location={location}/>
            </div>
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
