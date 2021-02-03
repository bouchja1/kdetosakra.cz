import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { Redirect } from 'react-router-dom';
import { Button } from 'antd';
import { CATEGORIES } from '../../enums/gaCategories';
import { generateRandomRadius } from '../../util';

export const RandomCity = () => {
    const [playGame, setPlayGame] = useState(false);

    if (playGame) {
        const randomRadius = generateRandomRadius();
        ReactGA.event({
            category: CATEGORIES.RANDOM_CITY,
            action: 'Play random city game',
        });
        return (
            <Redirect
                to={{
                    pathname: '/nahodne',
                    state: {
                        radius: randomRadius,
                        city: null,
                        mode: 'random',
                    },
                }}
            />
        );
    }

    return (
        <Button type="primary" disabled={playGame} onClick={() => setPlayGame(true)}>
            Hrát
        </Button>
    );
};
