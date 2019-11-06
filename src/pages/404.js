import React from 'react';
import { useLocation } from 'react-router';

const NotFound = () => {
    const location = useLocation();
    return <h1>Not found {location.pathname}</h1>;
};

export default NotFound;
