import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Auth from '../pages/Auth';
import Create from '../pages/Create';
import Dashboard from '../pages/Dashboard/Index';
import SetMoney from '../pages/SetMoney';
import GetMoney from '../pages/GetMoney';
import Tranfers from '../pages/Transfers';
import AlterStatus from '../pages/AlterStatus';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Auth}/>
            <Route path="/create" component={Create}/>
            <PrivateRoute path="/dash" component={Dashboard}/>
            <PrivateRoute path="/setMoney" component={SetMoney}/>
            <PrivateRoute path="/getMoney" component={GetMoney}/>
            <PrivateRoute path="/transfers" component={Tranfers}/>
            <PrivateRoute path="/alterStatus" component={AlterStatus}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;