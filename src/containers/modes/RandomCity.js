import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { CATEGORIES } from '../../enums/gaCategories';
import { generateRandomRadius } from '../../util';
import gameModes from '../../enums/modes';

export const RandomCity = () => {
    return (
        <Button
            type="primary"
            onClick={() => {
                ReactGA.event({
                    category: CATEGORIES.RANDOM_CITY,
                    action: 'Play random city game',
                });
            }}
        >
            <Link
                to={{
                    pathname: '/nahodne',
                    state: {
                        radius: generateRandomRadius(),
                        city: null,
                        mode: gameModes.random,
                    },
                }}
            >
                Hrát
            </Link>
        </Button>
    );
};
