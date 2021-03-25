import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
    Home, Info, Result, NotFound, Help
} from '../../pages';
import {
    CustomPlace, RegionCity, Random, RandomRegionalPlace, Geolocation, Battle
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
                <Random />
            </Route>
            <Route path={`/${routeNames.nahodneKraj}`}>
                <RandomRegionalPlace />
            </Route>
            <Route path={`/${routeNames.vysledek}`}>
                <Result />
            </Route>
            <Route path={`/${routeNames.vlastni}`}>
                <CustomPlace />
            </Route>
            <Route path={`/${routeNames.napoveda}`}>
                <Help />
            </Route>
            <Route path={`/${routeNames.info}`}>
                <Info />
            </Route>
            <Route path={`/${routeNames.battle}/:battleId`}>
                <Battle />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
