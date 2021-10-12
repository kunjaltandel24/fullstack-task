import React from 'react';
import { Switch } from 'react-router-dom';

import PublicRoute from '../../Components/PublicRoute';
import PrivateRoute from "../../Components/PrivateRoute";

const Login = React.lazy(() => import('../Login'));
const PrivateLayout = React.lazy(() => import('./PrivateLayout'));

export default () => {
    return (<div className="App">
        <React.Suspense fallback={() => 'loading...'}>
            <Switch>
                <PublicRoute exact path="/login" component={Login}/>
                <PrivateRoute path="/" component={PrivateLayout}/>
            </Switch>
        </React.Suspense>
    </div>);
}
