import React from 'react';
import ReactGA from 'react-ga4';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { routeNames } from '../constants/routes';
import { CATEGORIES } from '../enums/gaCategories';

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
                <Link
                    to={`/${routeNames.nahratMisto}`}
                    onClick={() => {
                        ReactGA.event({
                            category: CATEGORIES.UPLOAD_NEW_PLACE_CLICKED,
                            action: 'New place upload click',
                        });
                    }}
                >
                    Prosba o pomoc s přípravou nového herního módu "Zajímavá místa v ČR".
                </Link>
            </p>
        </NewGameModeHelpContainer>
    );
};
