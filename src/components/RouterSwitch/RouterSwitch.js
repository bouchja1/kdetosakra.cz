import React from 'react';
import { Route, Switch } from 'react-router-dom';

import {
    Home, Info, Result, NotFound
} from '../../pages';
import {
    CustomPlace, RegionCity, RandomCity, Geolocation
} from '../../containers/games';

const RouterSwitch = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/geolokace">
                <Geolocation />
            </Route>
            <Route path="/mesto">
                <RegionCity />
            </Route>
            <Route path="/nahodne">
                <RandomCity />
            </Route>
            <Route path="/vysledek">
                <Result />
            </Route>
            <Route path="/vlastni">
                <CustomPlace />
            </Route>
            <Route path="/info">
                <Info />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
