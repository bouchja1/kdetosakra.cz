import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../../pages/404';
import Configuration from "../Configuration";
import City from "../City";
import RandomCity from "../RandomCity";
import Result from "../Result";
import Geolocation from "../Geolocation";
import SuggestedCity from "../SuggestedCity";
import About from "../About";

const RouterSwitch = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Configuration />
            </Route>
            <Route path="/geolocation">
                <Geolocation />
            </Route>
            <Route path="/city">
                <City />
            </Route>
            <Route path="/random-city">
                <RandomCity />
            </Route>
            <Route path="/result">
                <Result />
            </Route>
            <Route path="/suggested">
                <SuggestedCity />
            </Route>
            <Route path="/about">
                <About />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
