import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from '../../pages/404';
import Configuration from "../Configuration";
import City from "../City";
import Geolocation from "../Geolocation";

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
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
