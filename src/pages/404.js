import React from 'react';
import { useLocation } from 'react-router';
import HeaderContainer from '../components/pageStructure/HeaderContainer';

const NotFound = () => {
    const location = useLocation();
    return (
        <>
            <h1>Not found {location.pathname}</h1>
        </>
    );
};

export default NotFound;
