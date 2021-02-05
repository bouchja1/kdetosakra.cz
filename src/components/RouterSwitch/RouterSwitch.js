import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
    Battle, Home, Info, Result, NotFound
} from '../../pages';
import {
    CustomPlace, RegionCity, RandomCity, Geolocation, BattleGame
} from '../../containers/games';
import routeNames from '../../constants/routes';

const RouterSwitch = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path={`/${routeNames.geolokace}`}>
                <Geolocation />
            </Route>
            <Route path={`/${routeNames.mesto}`}>
                <RegionCity />
            </Route>
            <Route path={`/${routeNames.nahodne}`}>
                <RandomCity />
            </Route>
            <Route path={`/${routeNames.vysledek}`}>
                <Result />
            </Route>
            <Route path={`/${routeNames.vlastni}`}>
                <CustomPlace />
            </Route>
            <Route path={`/${routeNames.info}`}>
                <Info />
            </Route>
            <Route path={`/${routeNames.geolokace}/:battleId`}>
                <Battle />
            </Route>
            <Route path={`/${routeNames.battle}`}>
                <BattleGame />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
