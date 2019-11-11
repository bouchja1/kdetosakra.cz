import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../../pages/404';
import City from '../City';
import RandomCity from '../RandomCity';
import Geolocation from '../Geolocation';
import SuggestedCity from '../SuggestedCity';
import Home from '../../pages/home';
import Info from '../../pages/info';
import Result from '../../pages/vysledek';

const RouterSwitch = ({ processHeaderContainerVisible }) => {
    return (
        <Switch>
            <Route exact path="/">
                <Home processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/geolokace">
                <Geolocation processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/mesto">
                <City processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/nahodne">
                <RandomCity processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/vysledek">
                <Result processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/vlastni">
                <SuggestedCity processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="/info">
                <Info processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
            <Route path="*">
                <NotFound processHeaderContainerVisible={processHeaderContainerVisible} />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
