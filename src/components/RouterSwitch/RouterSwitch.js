import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import NotFound from '../../pages/404';
import Configuration from "../Configuration";
import Panorama from "../Panorama";

const RouterSwitch = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Configuration />
            </Route>
            <Route exact path="/panorama">
                <Panorama />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouterSwitch;
