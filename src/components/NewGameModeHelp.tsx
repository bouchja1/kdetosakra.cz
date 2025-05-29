import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { routeNames } from '../constants/routes';
import { CATEGORIES } from '../enums/gaCategories';

const NewGameModeHelpContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ea648b;
    color: white;
    padding: 7px 0 7px 0;
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
                <Link to={`/${routeNames.endIsNear}`}>Provoz kdetosakra.cz bude v prosinci 2025 ukončen</Link>
            </p>
        </NewGameModeHelpContainer>
    );
};
