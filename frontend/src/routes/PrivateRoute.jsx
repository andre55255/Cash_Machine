import React, { useContext } from 'react';
import { AccountContext } from '../provider/account';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ component: Component, ...rest }) {

    const { account } = useContext(AccountContext);

    return (
        <Route 
            {...rest}
            render={props => 
                account.token ? (
                    <Component {...rest}/>
                ) : (
                    <Redirect to={{ pathname: "/", state: { from: props.location } }} />
                )
            }
        />
    );
}
