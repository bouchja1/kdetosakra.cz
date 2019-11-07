import React from 'react';
import {Link, Redirect, useLocation} from 'react-router-dom';
import Panorama from "../Panorama";

const City = () => {
    const location = useLocation();

    if (location && location.state && location.state.radius && location.state.city) {
        return (
            <div>
                <h2>Herní mód: {location.state.city.fullName}</h2>
                <h3>Maximální vzdálenost od místa: {location.state.radius} km</h3>
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

export default City;
