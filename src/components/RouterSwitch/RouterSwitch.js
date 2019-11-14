import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../../pages/404';
import City from '../City';
import RandomCity from '../RandomCity';
import Geolocation from '../Geolocation';
import SuggestedCity from '../SuggestedCity';
import Home from '../../pages/home';
import Info from '../../pages/info';
import Result from '../../pages/result';

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
                <City />
            </Route>
            <Route path="/nahodne">
                <RandomCity />
            </Route>
            <Route path="/vysledek">
                <Result />
            </Route>
            <Route path="/vlastni">
                <SuggestedCity />
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
