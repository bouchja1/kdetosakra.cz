import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { routeNames } from '../constants/routes';
import { CATEGORIES } from '../enums/gaCategories';

const NewGameModeHelpContainer = styled.div`
    display: flex;
    flex-direction: column;
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
                <Link to={`/${routeNames.endIsNear}`}>Provoz kdetosakra.cz bude v prosinci 2025 ukončen.</Link>
            </p>
            <p>
                <a href="https://developer.mapy.com/cs/js-api/ukonceni-podpory-js-sdk" target="_blank">
                    Od května 2025 už se ve hře objevují dočasné výpadky (pano se nenačte).
                </a>{' '}
                Bohužel, nedá se s tím nic dělat.
            </p>
        </NewGameModeHelpContainer>
    );
};
