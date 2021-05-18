import React from 'react';
import {
    HashRouter,
    Redirect,
    Switch,
    Route
} from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

class RouteMap extends React.Component {
    render() {
        return (
            <HashRouter>
                <main>
                    <Switch>
                        <Route path="/login" exact component={Login} />
                        <Route path="/signup" exact component={Signup} />
                        <Redirect to="/login" />
                    </Switch>
                </main>
            </HashRouter>
        )

    }
}

export default RouteMap;