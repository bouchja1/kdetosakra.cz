import { Button } from 'antd';
import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { routeNames } from '../../constants/routes';
import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { getRandomAmazingPlace } from '../../util';

export const AmazingPlaces = () => {
    const dispatch = useDispatch();
    const [playGame, setPlayGame] = useState(false);

    const handlePlayAmazingPlaces = () => {
        const randomPlace = getRandomAmazingPlace();
        ReactGA.event({
            category: CATEGORIES.AMAZING_PLACES,
            action: 'Play amazing places',
        });
        dispatch(
            // @ts-ignore
            setCurrentGame({
                mode: gameModes.amazingPlaces,
                round: 1,
                totalScore: 0,
                amazingPlace: randomPlace,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: `/${routeNames.uzasnaMista}`,
                }}
            />
        );
    }

    // browser is allowed to access user's LAT and LONG
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" type="primary" onClick={handlePlayAmazingPlaces}>
                    Hrát
                </Button>
            </div>
        </>
    );
};
