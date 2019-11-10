import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../../pages/404';
import Configuration from '../Configuration';
import City from '../City';
import RandomCity from '../RandomCity';
import Result from '../Result';
import Geolocation from '../Geolocation';
import SuggestedCity from '../SuggestedCity';
import About from '../About';

const RouterSwitch = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Configuration />
            </Route>
            <Route path="/geolokace">
                <Geolocation />
            </Route>
            <Route path="/mesto">
                <City />
            </Route>
            <Route path="/random">
                <RandomCity />
            </Route>
            <Route path="/vysledek">
                <Result />
            </Route>
            <Route path="/vlastni">
                <SuggestedCity />
            </Route>
            <Route path="/info">
                <About />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
