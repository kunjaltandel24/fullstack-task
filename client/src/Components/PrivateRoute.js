import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export default ({ component: Component, ...rest }) => {
    const auth = useSelector(state => state.auth);
    const isLoggedIn = auth.isLoggedIn;
    return <Route {...rest} render={(props) => {
        return isLoggedIn ? <Component {...props}/> : <Redirect to="/login"/>
    }} />;
}
