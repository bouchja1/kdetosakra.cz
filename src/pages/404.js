import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import HeaderContainer from '../components/pageStructure/HeaderContainer';

const NotFound = ({ processHeaderContainerVisible }) => {
    const location = useLocation();

    useEffect(() => {
        processHeaderContainerVisible(true);
    }, []);

    return (
        <>
            <h1>Not found {location.pathname}</h1>
        </>
    );
};

export default NotFound;
