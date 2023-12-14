import { Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { routeNames } from '../../constants/routes';
import { CATEGORIES } from '../../enums/gaCategories';
import gameModes from '../../enums/modes';
import { setCurrentGame } from '../../redux/actions/game';
import { getRandomCzechPlaceWithCoatOfArms } from '../../util';

export const Heraldry = () => {
    const dispatch = useDispatch();
    const [playGame, setPlayGame] = useState(false);

    const handlePlayHeraldry = () => {
        const randomCity = getRandomCzechPlaceWithCoatOfArms();
        dispatch(
            // @ts-ignore
            setCurrentGame({
                mode: gameModes.heraldry,
                round: 1,
                totalScore: 0,
                city: randomCity,
            }),
        );
        setPlayGame(true);
    };

    if (playGame) {
        return (
            <Redirect
                to={{
                    pathname: `/${routeNames.heraldika}`,
                }}
            />
        );
    }

    // browser is allowed to access user's LAT and LONG
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" type="primary" onClick={handlePlayHeraldry}>
                    Hrát
                </Button>
            </div>
        </>
    );
};
