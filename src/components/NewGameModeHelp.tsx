import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { routeNames } from '../constants/routes';

const NewGameModeHelpContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: white;
    padding: 5px 0 5px 0;
    font-weight: bold;

    p {
        margin: 0;
    }

    a {
        color: white;
        text-decoration: underline;
    }

    a:hover {
        color: whitesmoke;
        text-decoration: none;
    }
`;

export const NewGameModeHelp = () => {
    return (
        <NewGameModeHelpContainer>
            <p>
                <Link to={`/${routeNames.nahratMisto}`}>
                    Prosba o pomoc s přípravou nového herního módu "Zajímavá místa v ČR".
                </Link>
            </p>
        </NewGameModeHelpContainer>
    );
};
